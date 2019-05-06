export const PnlDD = (data,businessName,reportYear) => ({

    
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
       // font : 'hebrew'
	}
	
});