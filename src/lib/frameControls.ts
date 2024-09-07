// @ts-nocheck

/** the base frame controls class */
export class Controls {
  /** goes back */
  goBack(selector: HTMLIFrameElement) {
    selector.contentWindow.history.back();
  }

  /** goes forwards */
  goForth(selector: HTMLIFrameElement) {
    selector.contentWindow.history.forward();
  }

  /** reloads */
  reload(selector: HTMLIFrameElement) {
    selector.contentWindow.location.href = selector.contentWindow.location.href;
  }

  /**
   * navigates to a specified url
   * @param url the url to navigate to
   */
  go(url: string, selector: HTMLIFrameElement) {
    selector.contentWindow.location.href = url;
  }

  /**
   * pushes the state to a specified url without data
   * @param url the url to push the state to
   */
  pushState(url: string, selector: HTMLIFrameElement) {
    selector.contentWindow.history.pushState(null, null, url);
  }

  /**
   * fullscreens the iframe via the contentdocument api
   */
  fullscreen(selector: HTMLIFrameElement) {
    selector.contentDocument.documentElement.requestFullscreen();
  }
}
