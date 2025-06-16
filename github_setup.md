## App Registration Steps

[Register](https://github.com/settings/apps/new) a new GitHub App.

Fill in the required fields:
- *GitHub App Name*: `Your App Name`
- *Homepage URL*: `https://example.com`
- *Disable Webhooks*
- *Permissions*:
  - Repository: `Read-only` on contents
  - Organization: `Read-only` on private registries
  - Metadata: `Read-only` *\*(automatic set)*
- *Install Location*: `Only on this account`

---

## Generate and Save Keys

> [!WARNING]
> It should go without saying, but never share any of your tokens.
> This includes passwords, secrets or sessions ids...

Save the required information:
- Private Key (Download)
- Copy down:
  - App ID *(example: `1234567`)*
  - Client ID *(example: `abcdef12345ghijk`)*
  - Client Secret *(example: `97d88cd626ab79c9`)*

---

## Environment Configuration

Store your information safely in a `.env` file or similar process env storage:

```env
APP_ID=1234567
CLIENT_ID=abcdef12345ghijk
CLIENT_SECRET=97d88cd626ab79c9
```

---

## Install the App

1. Navigate to `Install App`
2. Install it onto your Organization
