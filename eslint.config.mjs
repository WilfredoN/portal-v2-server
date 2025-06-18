import antfu from '@antfu/eslint-config'

export default antfu({
    rules: {
        'antfu/no-top-level-await': 'off',
        "node/no-process-env": 'off',
        "node/prefer-global/process": 'off',
        "no-console": ['warn', { allow: ['warn', 'error'] }],
        'perfectionist/sort-imports': ['error', {
            internalPattern: ['^@/'],
        }],
        'unicorn/filename-case': ['error', {
            case: 'kebabCase',
            ignore: ['.*\\.md$'],
        }],
        "antfu/top-level-function": 'off',
        'prefer-arrow-callback': ['error'],
        'antfu/top-level-function': ['off'],
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'ts/consistent-type-imports': 'warn',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],

    },
})
