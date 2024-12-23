# ptchinacast

## Introduction

ptchinacast is a shrimpcast fork currently running on stream.ptchan.org, you should probably use the upstream shrimpcast version since this one is tailored for stream.ptchan.org.

## Table of Contents

- [Installation](#installation)
- [Debug](#debug)
- [Usage](#usage)
  - [Getting started](#getting-started)
  - [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
  - [Active Users](#active-users)
  - [Bans](#bans)
  - [Mutes](#mutes)
  - [Auto-mod filters](#auto-mod-filters)
  - [Moderators](#moderators)
  - [Notify users](#notify-users)
  - [Emotes](#emotes)
  - [Message and user management](#message-and-user-management)
  - [Cloud OBS](#cloud-obs)
  - [Whispers](#whispers)
- [License](#license)

## Installation

To build on linux:
  ```bash
  dotnet publish -c Release -r linux-x64 --self-contained -p:PublishSingleFile=true
  ```

## Debug

First, clone the repository.
To debug the project, you will need:
- Windows 10 
- Visual Studio 2022
- .NET 8 SDK & runtime
- PostgreSQL

Make sure that your PostgreSQL instance is properly configured.

## Usage

### Getting started

Once you have ptchinacast up and running, you will need to authenticate as an admin. To do this, use the token saved at `/root/shrimpcast/setup/GeneratedAdminToken.txt`, and follow these instructions:

![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/2c62fc16-0f58-4147-b90b-3daa610642a1)

1. Press the top-left button.
2. Paste the token and submit.

And that's it! You're now authenticated as an admin.

### Configuration

Once you're authenticated as an admin, you will have the following options:

![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/3708fdda-18fc-4fdd-b6fe-060c5d79e420)

- [Configuration](#configuration)
    - [Site](#site)
    - [Chat](#chat)
    - [Stream](#stream)
    - [Poll](#poll)
    - [OBS](#obs)
    - [Theme](#theme)
    - [Notifications](#notifications)
- [Active Users](#active-users)
- [Bans](#bans)
- [Mutes](#mutes)
- [Auto-mod filters](#auto-mod-filters)
- [Moderators](#moderators)
- [Notify users](#notify-users)
- [Emotes](#emotes)

#### Site
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/05228ef8-30cf-40d0-85d3-056acb9fee85)

- **Block TOR connections**: Will block connections from TOR exit nodes.
- **Max connections per IP**: The maximum number of simultaneous connections by a single IP address.
- **Minimum auto-mod time**: The minimum delay time expressed in milliseconds for the auto-mod.
- **Maximum auto-mod time**: The maximum delay time expressed in milliseconds for the auto-mod.
- **Open site at**: Time at which the site will be opened for users. While the site is closed, users will see a countdown:
  ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/4da09809-76ca-40dd-ba3f-d655480987f4)
- **Stream title**: The title of both the stream and site.
- **Stream description**: Description to show below the stream title.

#### Chat
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/dead4bd7-d876-488e-a76e-5f25aaae1425)

- **Enable chat:** Determines whether the chat feature is enabled or disabled for users.
- **Max visible messages:** Sets the maximum number of messages visible in the chat interface.
- **Message age limit (mins):** Specifies the age threshold of messages to display in the chat.
- **Required time for new users (mins):** Sets the minimum time (in minutes) that new users must wait before being allowed to send messages.
- **Cooldown between messages:** Specifies the time interval users must wait between sending consecutive messages, in seconds.
- **Mute time in minutes:** Determines the duration for which a user is muted after violating chat rules.
- **Default name for new users:** Sets the default username assigned to new users.

#### Stream
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/9acf769b-3a82-4d5d-a62a-8fa4380dc10b)

- **Enable stream:** Shows or hides the player.
- **Use primary source:** Specifies whether to use the primary source for the stream. Fallbacks to the secondary source if disabled.
- **Use native player:** Determines whether to use the browser's native player for streaming.
- **Treat URL as embed:** Dictates whether to treat URLs as embedded content for streaming purposes.
- **Enable Multistreams:** Allows users to switch between the primary and secondary sources simultaneously.
- **Primary stream URL:** Specifies the primary URL source for streaming content.
- **Secondary stream URL:** Provides an alternative URL source for streaming content if the primary source is unavailable.

#### Poll
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/44b1004c-d2bd-43b0-8d35-0b5f2a3c7dce)
- **Show poll:** Controls the visibility of the poll.
- **Accept new options:** Determines whether new options can be added to an existing poll.
- **Accept new votes:** Specifies whether new votes are allowed after a poll has started.
- **Make votes public:** Makes votes visible to all users.
- **Minimum sent to participate:** Sets the minimum number of messages a user must have sent to participate in a poll.
- **Poll title:** Specifies the title or topic of the poll being conducted.

#### OBS
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/8d626329-df9d-4caa-81df-056ff2d2b48b)
> [!TIP]
> You don't need any of these configurations unless you're using a cloud OBS instance and you want to control it remotely. If you're going to use them, make sure that your OBS has WebSockets enabled and is accepting incoming connections. See more on [cloud OBS](#cloud-obs)
- **Host:** Specifies the host for OBS connection. Format: (ws://[IP]:4455)
- **Password:** Provides the password required for authentication when connecting to OBS.
- **Main scene:** Specifies the main scene to be displayed in the OBS interface.
- **Main source:** Specifies the main video source to be displayed within the main scene.
- **Kino source:** Specifies the video source to be displayed in the "Kino" scene.
- **Music source:** Specifies the audio source to be optionally played during the broadcast.

#### Theme
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/908360b0-3a7d-4d27-94e2-6c6474cfd549)
- **Enable fireworks:** Enables or disables the display of fireworks animations.
- **Enable Christmas theme:** Activates or deactivates the Christmas theme.
- **Christmas theme snowflake count:** Specifies the number of snowflakes displayed as part of the Christmas theme.

#### Notifications
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/2449c7b8-f09a-4a7f-ad4e-c7447735aa46)
> [!CAUTION]
> Do not change these values unless you know what you're doing.
- **VAPID Public Key:** Specifies the public key for VAPID authentication.
- **VAPID Private Key:** Specifies the private key for VAPID authentication.
- **VAPID Mail:** Provides the email address associated with VAPID authentication.

### Bans
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/c4066618-ae54-4930-ae06-7a773d339872)

Shows the list of banned users. Use the button on the right to unban the user.

### Mutes
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/45a00624-5b5e-4456-999f-0a1ea85697e0)

Shows the list of currently muted users. To remove a mute, use the button on the right.

### Active users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/13d5e33d-121e-4f16-b243-778017587cfb)

Show the list of active users. Use the button on the right to display their information.

### Auto-mod filters
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/43fdfdd5-da5c-46fd-9d5c-9bcebd777f92)

Shows the list of active auto-mod filters. Use the button on the right to remove them.

### Moderators
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/9f9183d5-f3ee-4086-9f9c-7eb54725ebe0)

Shows the list of moderators. Use the button on the right to unmod them.

### Notify users
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/cfd0c047-277f-4fce-b399-6356e165392c)

Shows a dialog asking whether to notify the subscribed users that the stream has started.

### Emotes
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/fb6d898c-a218-420c-96e0-d86ae10c205b)

Shows the list of active emotes. To add a new emote, click on "ADD". Keep in mind that the size can't be greater than 36x36.

### Message and user management
![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/3f3f9780-c7e4-4106-a9e4-1ba28fa3cda8)

While authenticated as an admin, hover over a message and you will have the options to:
1. Remove the message (by clicking on the remove button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/7e718ae2-ed98-43e7-bd64-261e7383d030)
   
2. Manage the user (by clicking on the user button)
   
   ![image](https://github.com/shrimpcast/shrimpcast/assets/167498236/395510c7-1417-485b-bd53-1fa483a8d32b)

   The following moderation options will be available:
   - **Make mod**: Grants the user moderator privileges.
   - **Ignore**: Ignores the user. This option is available to all users.
   - **Mute**: mutes the user for the amount of time dettermined in the chat [configuration](#chat)
   - **Ban**: Bans the user and displays a public chat message indicating that the user has been removed from chat.
     >Caution: when issuing a ban, all IPs associated with the user will be blocked.  
   - **Silent ban**: Bans the user without notifying the chat.
   - **Silent ban and delete**: Issues a ban and removes the user messages without notifying the chat.
   - **Filter and ban**: Same as **Silent ban and delete**, but also adds the message to the auto-mod filters
> [!WARNING]
> The auto-mod tool isn't intended for censorhip but to ease the removal of spam. Note that adding a filter will result in any user whose message contains the filter being banned.

### Cloud OBS

If you're utilizing a cloud OBS instance, manage it effortlessly through chat commands:

- `!playmain [URL?]`
- `!playkino [URL?]`
- `!playmusic [URL?]`

### Whispers

Admins can securely send private messages to users using the following chat command:

- `!ping [SessionId] [Message]`

Retrieve the SessionId from the [Message and User Management](#message-and-user-management) section.

## License

This project is licensed under the [GNU License](LICENSE).
