using CoderAPI.Consumers.CodeRunner;
using CoderAPI.Consumers.LLM;
using CoderAPI.DBOs;
using CoderAPI.Hubs;
using CoderAPI.MicroService.Judge0.Implementation;
using CoderAPI.MicroService.Judge0.Interface;
using CoderAPI.MicroService.Queue.Implementation;
using CoderAPI.MicroService.Queue.Interface;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter JWT as: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey
    });

    // 👇 require JWT globally for protected endpoints
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// MassTransit + RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<CodeRunnerConsumer>();
    x.AddConsumer<LLMConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], h =>
        {
            h.Username(builder.Configuration["RabbitMq:Username"]);
            h.Password(builder.Configuration["RabbitMq:Password"]);
        });

        cfg.ReceiveEndpoint("code-runner-queue", e =>
        {
            e.ConfigureConsumer<CodeRunnerConsumer>(context);
            e.PrefetchCount = 16;
        });

        cfg.ReceiveEndpoint("llm-analyze-queue", e =>
        {
            e.ConfigureConsumer<LLMConsumer>(context);
            e.PrefetchCount = 8;
        });
    });
});
builder.Services.AddMassTransitHostedService();

builder.Services.AddSignalR();

// Register DI
builder.Services.Scan(scan => scan
    .FromApplicationDependencies()
    .AddClasses(classes => classes.InNamespaces("CoderAPI.Repository.Implementation"))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(classes => classes.InNamespaces("CoderAPI.Service.Implementation"))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(classes => classes.InNamespaces("CoderAPI.Helper.Implementation"))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(classes => classes.InNamespaces("CoderAPI.MicroService.Judge0.Implementation"))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(classes => classes.InNamespaces("CoderAPI.MicroService.Queue.Implementation"))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
);

// Register Judge0Service with HttpClient properly
builder.Services.AddHttpClient<IJudge0Service, Judge0Service>();

// Register QueuePublisher explicitly
builder.Services.AddScoped<IQueuePublisher, QueuePublisher>();
builder.Services.AddDbContext<CodeDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"], // must match token audience
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapHub<CodeExecutionHub>("/hubs/codeExecution");
app.UseHttpsRedirection();
app.UseCors("AllowReactDev");
app.UseAuthorization();

app.MapControllers();

app.Run();
