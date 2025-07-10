const files = import.meta.glob("./common/*.vue", { eager: true });

export default {
  install: (app: any) => {
    Object.keys(files).forEach((component) => {
      const file = (files[component] as any).default;
      console.log(file.name);

      if (file.name) {
        app.component(file.name, file);
      }
    });
  },
};
