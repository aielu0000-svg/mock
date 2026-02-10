(() => {
  "use strict";

  const e = React.createElement;

  function extractBody(html) {
    const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return (m ? m[1] : html)
      .replace(/<script[\s\S]*?<\/script>/gi, "");
  }

  function matchMemberPath(pathname) {
    const m = pathname.match(/^\/member\/([^/]+)\/edit\/?$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function App() {
    const [html, setHtml] = React.useState("<main class='page'><p>読み込み中...</p></main>");

    React.useEffect(() => {
      const pathname = window.location.pathname;
      const memberId = matchMemberPath(pathname);
      const url = memberId
        ? `/legacy/member/${encodeURIComponent(memberId)}/edit`
        : "/legacy/signup";

      fetch(url, { headers: { "Accept": "text/html" } })
        .then((res) => res.text())
        .then((text) => {
          setHtml(extractBody(text));
          requestAnimationFrame(() => {
            if (memberId) {
              window.initMemberEditPage?.();
            } else {
              window.initSignupPage?.();
            }
          });
        })
        .catch(() => {
          setHtml("<main class='page'><p>画面の読み込みに失敗しました。</p></main>");
        });
    }, [window.location.pathname]);

    return e("div", {
      className: "min-h-screen",
      dangerouslySetInnerHTML: { __html: html }
    });
  }

  const rootEl = document.getElementById("spa-root");
  if (!rootEl) return;
  ReactDOM.createRoot(rootEl).render(e(App));
})();
