using Microsoft.AspNetCore.SignalR;

namespace CoderAPI.Hubs
{
    public class CodeExecutionHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            // You can add custom logic here if needed when a client connects
            return base.OnConnectedAsync();
        }
        public async Task JoinSolutionGroup(string userSessionId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userSessionId);
        }
    }
}
