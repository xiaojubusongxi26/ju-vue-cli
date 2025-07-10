// directives/v-submit.ts
import type { Directive } from "vue";

const vSubmit: Directive = {
  mounted(el, binding) {
    let locked = false;
    const originalHTML = el.innerHTML;

    el.addEventListener("click", async (e: Event) => {
      if (locked) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      const fn = binding.value;
      if (typeof fn !== "function") {
        console.warn("v-submit expects a function");
        return;
      }

      locked = true;
      el.disabled = true;
      el.innerHTML = "处理中...";

      // 设置最大等待时间（默认 10s）
      const timeout = setTimeout(() => {
        locked = false;
        el.disabled = false;
        el.innerHTML = originalHTML;
      }, 10000);

      try {
        const result = fn();
        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        console.error("v-submit 执行出错：", err);
      } finally {
        clearTimeout(timeout);
        locked = false;
        el.disabled = false;
        el.innerHTML = originalHTML;
      }
    });
  },
};

export default vSubmit;
