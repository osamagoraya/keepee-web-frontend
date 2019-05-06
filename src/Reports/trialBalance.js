export const tbDD = (data,businessName,reportYear) => ({
    // background color of whole document
    background: function () {
        return {
	        canvas: [
				{
					type: 'rect',
					x: 0, y: 0, w: 595.28, h: 841.89,
					color: '#F8F8F8'
				}
			]
	    };
    },
	content: [
        {text: businessName, style: 'header', margin: [5,0],alignment:"right"},
		{text: reportYear, style: 'header', margin: [5,0]},
		{
            style: 'tableExample',
            unbreakable: true,
			table: {
			    widths: ['*'],
				body: [
					[
						{
							text: {},
							fillColor: '#F8F8F8',
							border: [false, false, false, true],
							margin: [15,0]
						}
					]
				]
			},
			layout: {
				hLineColor: '#828389'
			}
		}, // Line
		{
			style: 'tableExample',
			table: {
			    widths: [140,'*','*','*'],
                heights: [20],
                unbreakable: true,
				body: [
					[
						{
							text: {text:'Account',alignment:'left',bold: true},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [15,10]
						},
						{
							text: {text:'Credit',alignment:'center',bold: true},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [5,10]
						},
						{
							text: {text:'Debit',alignment:'center',bold: true},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [5,10]
						},
						{
							text: {text:'Balance',alignment:'center',bold: true},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [5,10]
						},
					]
				]
			}
		}, // Grey header
		data
	],
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			margin: [0, 0, 0, 5]
		},
		subheader: {
			fontSize: 16,
			bold: true,
			margin: [0, 10, 0, 5]
		},
		tableExample: {
			margin: [0, 5, 0, 0]
		},
		input: {
			margin: [0, 15, 0, 15]
		},
		tableHeader: {
			bold: true,
			fontSize: 13,
			color: 'black'
		}
	},
	defaultStyle: {
	}
	
}
);