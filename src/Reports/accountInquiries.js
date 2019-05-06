export const accountInquiryDD = (data,businessName,userNID) => ({

    
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
        {text: businessName + " - "  + userNID, style: 'header', margin: [5,0],alignment: 'right'},
		
		{
            style: 'tableExample',
            "dontBreakRows": true,
			table: {
                "dontBreakRows": true,
			    widths: [40,45,40,45,40,40,45,45,40,45],
			    heights: [20],
				body: [
					[
						{
							text: {text:'JE',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Movement',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Batch',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Reference',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Date',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Vendor',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Details',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Credit',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Debit',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
						{
							text: {text:'Balance',alignment:'center',bold: true,fontSize: 9},
							fillColor: '#dbdada;',
							border: [false, false, false, false],
							margin: [0,10]
						},
					]
				]
			}
        },
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