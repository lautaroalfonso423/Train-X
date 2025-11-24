// "use client"

// import Script from "next/script"
// import { useEffect } from "react"

// declare global {
//     interface Window {
//       botpress: any
//     }
//   }

// export default function BotpressChat() {
//   useEffect(() => {
//     // Evita errores si Botpress aún no está cargado
//     console.log("chatbot")
//     if (!window.botpress) return

//     window.botpress.on("webchat:ready", () => {
//       window.botpress.open()
//     })

//     window.botpress.init({
//       botId: "511018bb-1b7a-472b-b52b-38161deac9db",
//       clientId: "f274be26-cc2a-46aa-a18c-009d453270ee",
//       selector: "#webchat",
//       configuration: {
//         version: "v2",
//         botName: "Asistente Fitness",
//         color: "#f76b15",
//         variant: "solid",
//         themeMode: "dark",
//         feedbackEnabled: false,
//         soundEnabled: false,
//         proactiveMessageEnabled: false,
//         radius: 2.5,
//         fontFamily: "inter",
//       },
//     })
//   }, [])

//   return (
//     <>
//       {/* Inyecta el script de Botpress */}
//       <Script
//         src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
//         strategy="afterInteractive"
//       />

//       {/* Contenedor del chat */}
//       <div
//         id="webchat"
//         style={{
//           width: "100%",
//           height: "600px",
//           maxWidth: "100%",
//           maxHeight: "100%",
//         }}
//       />

//       {/* Estilos personalizados */}
//       <style jsx global>{`
//         #webchat .bpWebchat {
//           position: unset;
//           width: 100%;
//           height: 100%;
//           max-height: 100%;
//           max-width: 100%;
//         }
//         #webchat .bpFab {
//           display: none;
//         }
//       `}</style>
//     </>
//   )
// }


"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

declare global {
  interface Window {
    botpress: any
  }
}

export default function BotpressChat() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!loaded || !window.botpress) return

    window.botpress.init({
      botId: "511018bb-1b7a-472b-b52b-38161deac9db",
      clientId: "f274be26-cc2a-46aa-a18c-009d453270ee",
      selector: "#webchat",
      // ⚠️ clave: modo embebido
      embedded: true,
      configuration: {
        version: "v2",
        botName: "Asistente Fitness",
        color: "#f76b15",
        variant: "solid",
        headerVariant: "solid",
        themeMode: "dark",
        fontFamily: "inter",
        radius: 2.5,
        feedbackEnabled: false,
        footer: "[⚡ by Botpress](https://botpress.com/?from=webchat)",
        soundEnabled: false,
        proactiveMessageEnabled: false,
        proactiveBubbleMessage: "Hi! 👋 Need help?",
        proactiveBubbleTriggerType: "afterDelay",
        proactiveBubbleDelayTime: 10,
      },
    })

    window.botpress.on("webchat:ready", () => {
      window.botpress.open()
    })
  }, [loaded])

  return (
    <>
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("✅ Botpress script cargado correctamente")
          setLoaded(true)
        }}
      />

      {/* Contenedor del chat embebido */}
      <div
        id="webchat"
        className="w-full h-[500px] max-w-full max-h-full rounded-xl overflow-hidden"
      />

      {/* Estilos embebidos (sin burbuja) */}
      <style jsx global>{`
        #webchat .bpWebchat {
          position: unset;
          width: 100%;
          height: 100%;
          max-height: 100%;
          max-width: 100%;
        }
        #webchat .bpFab {
          display: none !important;
        }
      `}</style>
    </>
  )
}
