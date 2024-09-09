<div align="center">

<h1>
<img src="https://github.com/Zain-ul-din/whatsapp-ai-bot/assets/78583049/d31339cf-b4ae-450e-95b9-53d21e4641a0" width="35" height="35"/>
WhatsApp Ping 🔔</h1>
</div>

Catching messages on Gmail from clients always has me running late, and checking it over and over can be a real drag. That's why I created `whatsapp ping`! It lets me ping myself on WhatsApp using a webhook.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zain-ul-din/whatsapp-ping)

_web UI Example:_

![image](https://github.com/user-attachments/assets/d4212d3c-aee0-4eee-8c9d-4e6b69d9751c)


### Use Cases

few use cases of this project generated by gpt.

- 🔔 Instant Notifications: Get WhatsApp alerts for important client emails.
- 📬 Stay Connected: Easily send quick messages to your team or clients.
- 📅 Task Reminders: Schedule pings to remind yourself of upcoming tasks.
- 🎉 Timely Notification: Wish your friend a happy birthday right on time.
- 👨‍💻 Programmatic Use: Thanks to webhooks, integrate notifications into any app or service.

### Usage

clone or fork the repo and install all dependencies using your favorite package manager. In my case, i'm using `pnpm`.

```bash
pnpm i
```

**Prepare environment variables:**

you need two env's to make this work

```env
API_KEY=YOUR_API_KEY
MONGO_URL=your_url
```

We use `api-key` for authentication you can use any key you like to use but we recommend using strong key that is not vulnerable to `brute-force` attack.

```bash
openssl rand -base64 256
```

To run this bot in a serverless environment, we use MongoDB to manage the authentication state.

You can Get the MongoDB URL for free from their [website](https://www.mongodb.com/).

```js
mongodb+srv://<user_name>:<password>@cluster0.usggwa4.mongodb.net/?retryWrites=true&w=majority
```

**start the server using the following command:**

```bash
pnpm dev # start development server
OR
pnpm start # start server in production
```

After starting the server, it will print QR code in the terminal scan it using your phone to connect whatsapp.

### ⚓ Web Hook Usage

Next use web hook as following to send a message,

```c
curl -X POST localhost:8080/ping \
    -H "Authorization: Bearer $YOUR_API_KEY"
    -d '{
        "message": "hello world",
        "numbers": ["123456789012"]
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
    numbers: ["<country_code_without_plus><...number>"]
  })
})
  .then((res) => res.text())
  .then((res) => console.log(res));
```

### Caveats

```diff
- If you plan to deploy this project, it currently works only on VPS and not in a serverless environment. This means you will not be able to deploy it to the Vercel or other serverless providers.
+ We just added support for serverless deployment https://github.com/Zain-ul-din/whatsapp-ping/issues/2
```

<br>

## Sponsors:

A big thank you to these people for supporting this project.

<table>
 <thead>
  <tr>
   <th>
    <img src="https://avatars.githubusercontent.com/u/97310455?v=4" width="150" height="150" />
   </th>
   <th>
    <img src="https://avatars.githubusercontent.com/u/0?v=4" width="150" height="150"/>
   </th>
  </tr>
 </thead>
 <tbody>
   <tr>
    <td align="center">
     <a target="_blank" href="https://github.com/levitco">Ahtisham Abbas Qureshi</a>
    </td>
    <td align="center">
    <a target="_blank" href="https://www.buymeacoffee.com/zainuldin">YOU?</a>
    </td>
   </tr>
 </tbody>
</table>



#### Thanks to These Awesome Projects:

- [@whiskeysockets/baileys](https://www.npmjs.com/package/@whiskeysockets/baileys)
- [mongo-baileys](https://www.npmjs.com/package/mongo-baileys)

---

<div align="center">
<h4 font-weight="bold">This repository is maintained by <a href="https://github.com/Zain-ul-din">Zain-Ul-Din</a></h4>
<p> Show some ❤️ by starring this awesome repository! </p>
</div>

<div align="center">
<a href="https://www.buymeacoffee.com/zainuldin" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

</div>
