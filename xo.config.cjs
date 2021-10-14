module.exports = {
	overrides: [
		{
			files: ['**/*.ts'],
			rules: {
				'@typescript-eslint/naming-convention': [
					'error',
					{
						selector: 'default',
						format: [
							'camelCase',
						],
						leadingUnderscore: 'allow',
						trailingUnderscore: 'allow',
					},
					{
						selector: 'variable',
						format: [
							'camelCase',
							'UPPER_CASE',
						],
						leadingUnderscore: 'allow',
						trailingUnderscore: 'allow',
					},
					{
						selector: 'typeLike',
						format: [
							'PascalCase',
						],
					},
					{
						selector: [
							'variable',
							'parameter',
							'classProperty',
							'objectLiteralProperty',
						],
						format: [
							'StrictPascalCase',
						],
						filter: {
							regex: '^(Bucket|Key|Body)$|^S3',
							match: true,
						},
					},
				],
			},
		},
	],
};
