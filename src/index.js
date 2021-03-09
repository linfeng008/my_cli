const { program } = require("commander"); // command
const download = require("download-git-repo"); // git
const ora = require("ora"); // loading
const chalk = require("chalk"); // 改变log 颜色背景以及加粗
const logSymbols = require("log-symbols");
const { version } = require("../package.json");
const { chooseTemplate } = require("./inquirers");
const { templateMap } = require("./templateMap");
const shell = require("shelljs");
const CBuild = require("../webpack/build.prod");

function start() {
  program.version(version); // 输出版本号

  program
    .command("create <projectName>")
    .description("初始化项目模版")
    .option("-T, --template [template]", "输入使用的模板名字")
    .action(async function (projectName, options) {
      let template = options.template;
      projectName = projectName || "untitiled";

      if (!template) {
        template = await chooseTemplate(); // 注意这是一个异步方法
      }
      console.log(`成功创建模版${projectName}`);
      console.log(
        chalk.rgb(69, 39, 160)("你选择的模板是 👉"),
        chalk.bgRgb(69, 39, 160)(template)
      );

      // 下载提示
      const spinner = ora({
        text: "正在下载模版...",
        color: "yellow",
        spinner: {
          interval: 80,
          frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
      });
      spinner.start();

      console.log("创建项目---", projectName);
      const downloadUrl = templateMap.get(template); // templateMap 是一个引入的自定义Map
      console.log(downloadUrl);
      download(downloadUrl, projectName, { clone: true }, async (err) => {
        if (err) {
          console.log(err);
          console.log("下载失败");
          spinner.fail();
        } else {
          // 安装依赖
          await shell.exec(
            `
                      cd ${projectName}
                      npm i
                    `,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
          spinner.succeed();
          console.log(
            logSymbols.success,
            chalk(chalk.green.bold.bgBlack("下载成功"))
          );
        }
      });
    });

  program
    .command("build")
    .description("打包")
    .action(async function () {
      const project_root_path = process.cwd();
      CBuild(project_root_path);
    });

  program
    .command("checkAll")
    .description("查看所有模版")
    .action(function () {
      const templateList = ["template-default-react", "template-default-vue"];
      templateList.map((temp, index) => {
        console.log(`(${index}) ${temp}`);
      });
    });
  program
    .command("help")
    .description("查看所有可用模版的帮助")
    .action(function () {
      console.log("在这里查看可以书写相关的帮助信息");
    });
  program.parse(process.argv); // parse方法则是让命令行可以解析我们之前配置的命令。
}

start();
