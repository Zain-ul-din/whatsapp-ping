<div align="center">

<h1>
<img src="https://github.com/Zain-ul-din/whatsapp-ai-bot/assets/78583049/d31339cf-b4ae-450e-95b9-53d21e4641a0" width="35" height="35"/>
WhatsApp Ping 🔔</h1>
</div>

Catching messages on Gmail from clients always has me running late, and checking it over and over can be a real drag. That's why I created `whatsapp ping`! It lets me ping myself on WhatsApp using a webhook.

### Usage

clone or fork the repo and install all dependencies using your favorite package manager. In my case, i'm using `pnpm`.

```bash
pnpm i
```

Prepare environment variables,

We use `api-key` for authentication you can use any key you like to use but we recommend using strong key that is not vulnerable to `brute-force` attack.

```bash
openssl rand -base64 256
```

start the server using following command,

```bash
pnpm dev # start development server
OR
pnpm start # start server in production
```

After starting the server, it will print QR code in the terminal scan it using your phone to connect whatsapp.

Next use web hook as following to send a message,

```c
curl -X POST localhost:8080/ping \
    -H "Authorization: Bearer $YOUR_API_KEY"
    -d '{
        "message": "hello world",
        "number": "123456789012"
    }'
```

using js,

```js
fetch("http://localhost:8080/ping", {
  headers: {
    Authorization: "Bearer YOUR_KEY",
    "Content-Type": "application/json"
  },
  method: "POST",
  body: JSON.stringify({
    message: "hey",
    number: "<country_code_without_plus><..number>"
  })
})
  .then((res) => res.text())
  .then((res) => console.log(res));
```

## Caveats

If you plan to deploy this project, it currently works only on VPS and not in a serverless environment. This means you will not be able to deploy it to the Vercel or other serverless providers.

<br>

---

<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>

<div align="center">
<a href="https://www.buymeacoffee.com/zainuldin" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

</div>
