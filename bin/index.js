#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program.name("ju-vue-cli").description("你的专属脚手架").version("1.0.0");

program
  .command("init")
  .description("初始化一个新项目")
  .action(async () => {
    const { projectName, templateType } = await inquirer.prompt([
      {
        name: "projectName",
        message: "请输入项目名称：",
        validate: (input) => (input ? true : "项目名称不能为空"),
      },
      {
        type: "list",
        name: "templateType",
        message: "请选择模板类型：",
        choices: [
          { name: "PC端（vue-template）", value: "vue-template" },
          { name: "H5端（vue-template-h5）", value: "vue-template-h5" },
        ],
      },
    ]);

    const targetDir = path.resolve(process.cwd(), projectName);
    const templateDir = path.resolve(__dirname, `../templates/${templateType}`);

    if (fs.existsSync(targetDir)) {
      console.log(chalk.red(`❌ 文件夹 ${projectName} 已存在！`));
      process.exit(1);
    }

    console.log(chalk.cyan(`🚀 正在创建项目：${projectName}`));

    // 复制模板文件
    fs.copySync(templateDir, targetDir);

    // 进入目录并安装依赖
    // console.log(chalk.yellow("📦 正在安装依赖..."));
    // execSync("pnpm install", { cwd: targetDir, stdio: "inherit" });

    console.log(chalk.green("✅ 项目创建成功！"));
    console.log(`👉 cd ${projectName} && pnpm dev`);
  });

program.parse();
