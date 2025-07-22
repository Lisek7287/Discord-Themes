const { React, getByProps, findModuleByProps } = window.RevengeAPI;
const ChannelsStore = getByProps("getUnreadGuilds");
const Dispatcher = getByProps("dispatch", "subscribe");
const { closeDrawer } = getByProps("closeDrawer");

function markAllAsRead() {
  const unreadGuilds = ChannelsStore.getUnreadGuilds();
  
  unreadGuilds.forEach(guildId => {
    const channels = ChannelsStore.getUnreadGuildChannels(guildId);
    channels.forEach(channel => {
      Dispatcher.dispatch({
        type: "MARK_AS_READ",
        channelId: channel.channel.id
      });
    });
  });

  closeDrawer(); // zamyka sidebar po kliknięciu
}

function addCustomButton() {
  const Sidebar = findModuleByProps("SidebarNav");
  if (!Sidebar) return;

  const HomeButton = document.querySelector('[aria-label="Home"]');
  if (!HomeButton) return;

  const newButton = document.createElement("div");
  newButton.innerText = "✅ Oznacz jako przeczytane";
  newButton.style.cssText = `
    color: orange;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
  `;
  newButton.onclick = markAllAsRead;

  HomeButton.parentElement.appendChild(newButton);
}

setTimeout(addCustomButton, 3000); // Odczekaj aż sidebar się załaduje
