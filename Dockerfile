FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY ["CoderAPI/CoderAPI.csproj", "CoderAPI/"]
RUN dotnet restore "CoderAPI/CoderAPI.csproj"

# copy everything else and publish
COPY . .
WORKDIR /src/CoderAPI
RUN dotnet publish "CoderAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "CoderAPI.dll"]
