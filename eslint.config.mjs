import antfu from '@antfu/eslint-config'

export default antfu({
    rules: {
        'antfu/no-top-level-await': 'off',
        'perfectionist/sort-imports': ['error', {
            internalPattern: ['^@/'],
        }],
        'unicorn/filename-case': ['error', {
            cases: {

                kebabCase: true,
                ignore: ['*.md'],
            },
        }],
        'prefer-arrow-callback': 'error',
        'antfu/top-level-functions': 'off',
        'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
        'style/brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'ts/explicit-function-return-type': 'warn',
        'ts/consistent-type-imports': 'warn',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],

    },
})
