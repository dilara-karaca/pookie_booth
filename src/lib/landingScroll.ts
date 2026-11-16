export function scrollLanding(target: "home" | "how", behavior: ScrollBehavior = "auto") {
  const scroller = document.getElementById("landing-scroll");
  if (!scroller) return;
  if (target === "home") {
    scroller.scrollTo({ top: 0, behavior });
    return;
  }
  const how = document.getElementById("how");
  if (!how) return;
  const top = how.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
  scroller.scrollTo({ top, behavior });
}
