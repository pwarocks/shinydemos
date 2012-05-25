
var options = {
	title:"{{title}}",
	legend:"{{legend}}",
	tags:[{{{arrayify tags}}}],
	features:[{{#each features}}
		{
			slug: "{{this.slug}}",
			title: "{{this.title}}",
			link: "{{this.link}}"
		},{{/each}}
	  {oldIEHatesTrailingCommas: true}
	]
};

appendPanel(options);
