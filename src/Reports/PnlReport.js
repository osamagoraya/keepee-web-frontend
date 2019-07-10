let writeTextToDataURL = function(text, color='black', top=1, bottom=13, size = "1px Roboto, sans-serif", height = 3, width = 100)
  {
    var x = document.createElement("CANVAS");
    var context = x.getContext("2d");
  
    x.height = height;
    x.width = width;
  
  
    context.fillStyle = color;
    context.font = size;
    context.textBaseline = "top";
    context.beginPath();
    context.fillText(text, top, bottom,700);
    context.scale(2, 2)
    context.closePath();
    context.fill();
  
  
    return x.toDataURL();
  }
export const PnlDD = (data,businessName,reportYear, userNID) => ({

    
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
        {
			image: writeTextToDataURL(businessName + " - " + userNID,'black', 1, 1, "bold 12px Heebo", 20,businessName.length > 11 ? 180 : 140),
        	alignment:"left"
		},
		{
			image: writeTextToDataURL(reportYear + ' דוח רווח והפסד שנת','black', 1, 1, "bold 12px Heebo", 20,180),
			 margin: [-15,-10], 
			 alignment:"right" 
		},
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