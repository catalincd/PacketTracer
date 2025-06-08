function $(selector) {
  const elements = document.querySelectorAll(selector);

  return {
    elements,
    html(content) {
      if (content === undefined) {
        return this.elements[0] ? this.elements[0].innerHTML : null;
      } else {
        this.elements.forEach(el => el.innerHTML = content);
        return this;
      }
    },
    css(property, value) {
      if (value === undefined) {
        return this.elements[0] ? getComputedStyle(this.elements[0])[property] : null;
      } else {
        this.elements.forEach(el => el.style[property] = value);
        return this;
      }
    },
    hide() {
      this.elements.forEach(el => {
        el.style.display = 'none';
      });
      return this;
    },
    show() {
      this.elements.forEach(el => {
        el.style.display = 'block';
      });
      return this;
    },
    on(event, handler) {
      this.elements.forEach(el => {
        el.addEventListener(event, handler);
      });
      return this;
    },
    attr(name, value) {
      if (value === undefined) {
        return this.elements[0]?.getAttribute(name) ?? null;
      } else {
        this.elements.forEach(el => el.setAttribute(name, value));
        return this;
      }
    },
    removeAttr(name) {
      this.elements.forEach(el => el.removeAttribute(name));
      return this;
    },
    addClass(className) {
      this.elements.forEach(el => el.classList.add(className));
      return this;
    },
    removeClass(className) {
      this.elements.forEach(el => el.classList.remove(className));
      return this;
    }
  };
}
