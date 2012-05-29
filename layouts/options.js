
var options = {
	title:'{{title}}',
	legend:'{{legend}}',
	tags:[{{{arrayify tags}}}],
	features:[{{#each features}}
		{
			name: '{{this.slug}}',
			title: '{{this.title}}',
			link: '{{this.link}}'
		},{{/each}}
	  { build: {{version}} }
	]
};

appendPanel(options);
