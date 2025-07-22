// TypeScript version

const { React, getByProps, findModuleByProps } = (window as any).RevengeAPI;

// Typowanie modułów Discorda (przybliżone)
interface Channel {
  id: string;
}

interface UnreadChannel {
  channel: Channel;
}

interface ChannelsStoreType {
  getUnreadGuilds: () => string[];
  getUnreadGuildChannels: (guildId: string) => UnreadChannel[];
}

interface DispatcherType {
  dispatch: (action: { type: string; channelId: string }) => void;
  subscribe: (...args: any[]) => void;
}

interface DrawerModule {
  closeDrawer: () => void;
}

const ChannelsStore = getByProps("getUnreadGuilds") as ChannelsStoreType;
const Dispatcher = getByProps("dispatch", "subscribe") as DispatcherType;
const { closeDrawer } = getByProps("closeDrawer") as DrawerModule;

function markAllAsRead(): void {
  const unreadGuilds = ChannelsStore.getUnreadGuilds();

  unreadGuilds.forEach((guildId: string) => {
    const channels = ChannelsStore.getUnreadGuildChannels(guildId);
    channels.forEach((channel: UnreadChannel) => {
      Dispatcher.dispatch({
        type: "MARK_AS_READ",
        channelId: channel.channel.id,
      });
    });
  });

  closeDrawer(); // Zamyka sidebar po kliknięciu
}

function addCustomButton(): void {
  const Sidebar = findModuleByProps("SidebarNav");
  if (!Sidebar) return;

  const HomeButton = document.querySelector('[aria-label="Home"]') as HTMLElement | null;
  if (!HomeButton || !HomeButton.parentElement) return;

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
