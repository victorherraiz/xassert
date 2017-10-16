
module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "eqeqeq": ["error"],
        "no-trailing-spaces": ["error"],
        "no-multi-spaces": ["error"],
        "comma-spacing": ["error"],
        "array-bracket-spacing": ["error", "never"],
        "complexity": ["error", 10],
        "consistent-return": ["error"],
        "no-var": ["error"],
        "curly": ["error"],
        "keyword-spacing": ["error"],
        "space-before-blocks": ["error"],
        "max-len": ["error", 80],
    }
};