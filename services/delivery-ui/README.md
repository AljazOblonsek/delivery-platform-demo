# Delivery UI

## Prerequiesities

- [Node v20.12.2](https://nodejs.org/en)

_Hint: You can use [nvm](https://github.com/nvm-sh/nvm) or [nvm for windows](https://github.com/coreybutler/nvm-windows) to manage multiple node installations._

## Quick Start

1. Follow documentation on [How to Set Up Backend for Frontend Development](../../docs/how-to-setup-backend-for-frontend-development.md) to setup and start the backend services
2. Navigate the terminal to the `delivery-ui` directory or open it directly in VSCode.
3. Run `npm install` to install node modules
4. Create new file named `env.js` in `delivery-ui` directory and paste in the following code:

```js
window.__env__ = {
  VITE_ENV: 'development',
  VITE_API_URL: 'http://localhost:8000',
};
```

5. Start the development environment with `npm run dev`
6. You should be able to access the site on [http://localhost:3001](http://localhost:3001)

## Testing QR Codes on Mobile Devices

To enable testing of the QR Code Scanning on mobile devices there's a few extra steps.

1. Mofify your environment variables by setting your `VITE_API_URL` to empty string like so:

```js
window.__env__ = {
  VITE_ENV: 'development',
  VITE_API_URL: '',
};
```

2. Start the development server using the following command:

```bash
ENABLE_MOBILE_DEV=true npm run dev
```

This will enable the server to be accessed over LAN and also generate a fake SSL certificate to access it over https. When requesting camera access we must use https connection.

3. Make sure to allow node process to go thru the firewall in your windows/mac firewall settings.
4. Access the app on your phone on the url provided in the console when you started the server. (Example Url: `https://192.168.1.111:3001`)
