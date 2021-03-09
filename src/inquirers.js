const inquirer = require("inquirer");

async function chooseTemplate() {
  const promptList = [
    {
      type: "list", // type决定交互的方式，比如当值为input的时候就是输入的形式，list就是单选，checkbox是多选...
      name: "template",
      message: "选择一个需要创建的工程化模版",
      choices: [
        {
          name: "template-default-react",
          value: "template-default-react",
        },
        {
          name: "template-default-vue",
          value: "template-default-vue",
        },
      ],
    },
  ];
  const answers = await inquirer.prompt(promptList); // 执行命令行交互，并将交互结果返回
  const { template } = answers;
  console.log(`你选择的模版是：${template}`);
  return template;
}

module.exports = {
  chooseTemplate,
};
