module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  globals: {
    __APP_VERSION__: true,
    defineOptions: "writable",
  },
  /* 指定如何解析语法。可以为空，但若不为空，只能配该值，原因见下文。*/
  parser: "vue-eslint-parser",
  /* 优先级低于parse的语法解析配置 */
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    ecmaVersion: "latest",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:@typescript-eslint/recommended",
    "./.eslintrc-auto-import.json",
    "prettier",
  ],
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    camelcase: 0, // 强制使用骆驼拼写法命名约定
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": 2,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/type-annotation-spacing": "warn",
    "@typescript-eslint/space-before-blocks": "warn",
    "@typescript-eslint/space-infix-ops": "warn",
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        multiline: {
          delimiter: "none",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
        multilineDetection: "brackets",
      },
    ],
    "@typescript-eslint/semi": ["warn", "never"],
    "@typescript-eslint/object-curly-spacing": ["warn", "always"],
    "array-callback-return": 1, // 强制数组方法的回调函数中有 return 语句,Array有几种过滤，映射和折叠的方法。如果我们忘记return在这些回调中写入语句，那可能是一个错误。
    "consistent-return": 0, // 要求 return 语句要么总是指定返回的值，要么不指定
    "default-case": 1, // 要求 switch 语句中有 default 分支
    "no-console": process.env.NODE_ENV === "production" ? 1 : 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 1 : 0,
    "no-useless-concat": 1, // 禁止不必要的字符串字面量或模板字面量的连接
    "no-useless-escape": 0, // 禁止不必要的转义字符
    "no-redeclare": 1, // 禁止多次声明同一变量
    "no-fallthrough": 1, // 禁止 case 语句落空
    "no-lonely-if": 1, // 禁止 if 作为唯一的语句出现在 else 语句中.如果一个if陈述是该else块中唯一的陈述，那么使用一个else if表格通常会更清晰。
    "no-irregular-whitespace": 1, // 禁止在字符串和注释之外不规则的空白
    "no-undef": "off", // 禁止
    "no-var": 1, // 使用 let，而不是 var
    "no-new-object": 1, // 使用字面值创建对象
    "no-array-constructor": 1, // 使用字面值创建数组
    "no-eval": 1, // 不要使用 eval()
    "no-new-func": 1, // 不要用函数构造器创建函数
    "arrow-parens": 1, // 在箭头函数参数两头，总是使用小括号包裹住参数
    "no-dupe-class-members": 1, // 避免重复定义类成员
    "no-duplicate-imports": 1, // 一个路径只 import 一次
    eqeqeq: 1, // 用 === 和 !== 而不是 == 和 !=
    "nonblock-statement-body-position": 1, // 用大括号包裹多行代码块
    "no-else-return": 1, // 如果 if 语句中总是需要用 return 返回，那后续的 else 就不需要写了
    "keyword-spacing": 1, // 在控制语句（if, while 等）的圆括号前空一格。在函数调用和定义时，参数列表和函数名之间不空格
    "space-before-blocks": 1, // 在大括号前空一格
    "no-multiple-empty-lines": 1, // 不要在代码之间使用多个空白行填充
    "no-trailing-spaces": 1, // 行末不要空格
    "comma-spacing": 1, // , 前不要空格， , 后需要空格
    "space-in-parens": 1, // 圆括号里不要加空格
    "array-bracket-spacing": 1, // 方括号里不要加空格
    "key-spacing": 1, // 在对象的字面量属性中， key 和 value 之间要有空格
    "comma-style": 1, // 不要前置逗号
    "space-infix-ops": 1, // 用空格来隔开运算符
    "arrow-spacing": 1, // 强制箭头函数的箭头前后使用一致的空格
    "object-curly-spacing": ["warn", "always"], // 花括号里加空格
    semi: ["warn", "never"], // 不需要分号结尾
    "prefer-const": 0, // 要求使用 const 声明那些声明后不再被修改的变量.如果一个变量从不重新分配，使用const声明更好。const 声明告诉读者，“这个变量永远不会被重新分配，”减少认知负荷并提高可维护性。
    "vue/script-setup-uses-vars": 1,
    "vue/no-multiple-template-root": 0,
    "vue/attributes-order": 2, // vue api使用顺序
    "vue/multi-word-component-names": 0,
    "vue/order-in-components": 0,
    "vue/require-default-prop": 1,
    "vue/max-attributes-per-line": [
      "error",
      {
        singleline: {
          max: 3,
        },
      },
    ],
  },
  overrides: [
    {
      files: ["./packages/renderer/src/api/**/*.ts"],
      rules: {
        camelcase: 0,
      },
    },
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        mocha: true,
      },
    },
  ],
};
