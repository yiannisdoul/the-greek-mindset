// //Google Analytics 4
// import Script from 'next/script'

// export default function App({ Component, pageProps }) {
//   return (
//     <>
//       <Script
//         src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
//         strategy="afterInteractive"
//       />
//       <Script id="google-analytics" strategy="afterInteractive">
//         {`
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){window.dataLayer.push(arguments);}
//           gtag('js', new Date());
//           gtag('config', '${GA_TRACKING_ID}');
//         `}
//       </Script>
//       <Component {...pageProps} />
//     </>
//   )
// }