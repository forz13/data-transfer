module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
    rules: {
        "no-console": "off",
        "global-require": "off",
        "import/prefer-default-export": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/camelcase":"off",
        "no-cond-assign": "off",
        "no-await-in-loop": "off"
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".ts"]
            }
        }
    },
};