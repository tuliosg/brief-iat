define(['pipAPI','pipScorer','underscore'], function(APIConstructor,Scorer, _) {

	/**
	Algumas coisas que este script não suporta atualmente:
	A extensão não suporta um bloco prático com apenas duas categorias. 
	Todos os blocos incluem estímulos de todas as categorias e de todos os atributos.
	Se houver mais de duas categorias, a extensão sempre inclui todas as categorias no bloco: 
	uma como a categoria focal e todas as demais como categorias não focais. 
	O número de estímulos da categoria focal é sempre igual ao número de estímulos das categorias não focais.
	O número de estímulos do atributo focal é sempre igual ao número de estímulos do atributo não focal.
	
	Por padrão: há apenas um atributo focal (agradável/pleasant), e a ordem das categorias focais é aleatória (mudam a cada bloco).
	
	Para pular um bloco na tarefa: pressione Esc e depois Enter. 
	
	O script salva algumas mensagens de feedback na tabela explícita. 
	A mensagem de feedback é sempre uma comparação entre a primeira e a segunda categoria. 
	Existem também pontuações únicas para cada categoria, 
	e os resultados de comparações específicas entre as categorias. 
	Execute a tarefa para conhecer os nomes dessas variáveis quando são salvas na tabela explícita.
	
	Criado por: Yoav Bar-Anan (baranan@gmail.com).
	Modificado por: Gal Maimon
	Traduzido e Adaptado para PT-BR
	**/

	function iatExtension(options)
	{
		var API = new APIConstructor();
		var scorer = new Scorer();
		var piCurrent = API.getCurrent();
		// Aqui configuramos as opções da nossa tarefa. Leia os comentários para entender o que cada uma significa.
		// Você também pode fazer isso externamente, com um arquivo jsp dedicado.
		var batObj = 
		{
			isTouch:false, //Define se a tarefa ocorre em um dispositivo touch.
			//Define a área de desenho (canvas) da tarefa
			canvas : {
				maxWidth: 725,
				proportions : 0.85,
				background: '#ffffff',
				borderWidth: 5,
				canvasBackground: '#ffffff',
				borderColor: 'lightblue'
			}, 
			practiceCategory1 : 
			{
				name : 'Mamíferos', 
				title : {
					media : {word : 'Mamíferos'}, 
					css : {color:'#31b404','font-size':'1.8em'}, 
					height : 4, 
					startStimulus : { 
						media : {word : 'Cachorros, Cavalos, Vacas, Leões'}, 
						css : {color:'#31b404','font-size':'1em'}, 
						height : 2
					}
				}, 
				stimulusMedia : [ 
					{word : 'Cachorros'}, 
					{word : 'Cavalos'}, 
					{word : 'Leões'}, 
					{word : 'Vacas'}
				], 
				stimulusCss : {color:'#31b404','font-size':'2em'}
			},	
			practiceCategory2 : 
			{
				name : 'Aves', 
				title : {
					media : {word : 'Aves'}, 
					css : {color:'#31b404','font-size':'1.8em'}, 
					height : 4,
					startStimulus : {
						media : {word : 'Pombos, Cisnes, Corvos, Gralhas'}, 
						css : {color:'#31b404','font-size':'1em'}, 
						height : 2
					}
				}, 
				stimulusMedia : [ 
					{word : 'Pombos'}, 
					{word : 'Cisnes'}, 
					{word : 'Corvos'}, 
					{word : 'Gralhas'}
				], 
				stimulusCss : {color:'#31b404','font-size':'2em'}
			},
			categories : [  
				{
					name : 'Pessoas Negras', 
					title : {
						media : {word : 'Pessoas Negras'}, 
						css : {color:'#31b404','font-size':'1.8em'}, 
						height : 4, 
						startStimulus : { 
							media : {word : 'Tyron, Malik, Terrell, Jazmin, Tiara, Shanice'}, 
							css : {color:'#31b404','font-size':'1em'}, 
							height : 2
						}
					}, 
					stimulusMedia : [ 
                    {word: 'Tyron'},
					{word: 'Malik'},
					{word: 'Terrell'},
					{word: 'Jazmin'},
					{word: 'Tiara'},
					{word: 'Shanice'}
					], 
					stimulusCss : {color:'#31b404','font-size':'2em'}
				},	
				{
					name : 'Pessoas Brancas', 
					title : {
						media : {word : 'Pessoas Brancas'}, 
						css : {color:'#31b404','font-size':'1.8em'}, 
						height : 4,
						startStimulus : {
							media : {word : 'Jake, Connor, Bradley, Alison, Emma, Emily'}, 
							css : {color:'#31b404','font-size':'1em'}, 
							height : 2
						}
					}, 
					stimulusMedia : [ 
                    {word: 'Jake'},
					{word: 'Connor'},
					{word: 'Bradley'},
					{word: 'Allison'},
					{word: 'Emma'},
					{word: 'Emily'}
					], 
					stimulusCss : {color:'#31b404','font-size':'2em'}
				}
			],
			attribute1 : 
			{
				name : 'Agradável', 
				title : {
					media : {word : 'Agradável'}, 
					css : {color:'#0000FF','font-size':'1.8em'}, 
					height : 4,
					startStimulus : {
						media : {word : 'Alegria, Amor, Feliz, Bom'}, 
						css : {color:'#0000FF','font-size':'1em'}, 
						height : 2
					}
				}, 
				stimulusMedia : [ 
					{word : 'Alegria'}, 
					{word : 'Amor'}, 
					{word : 'Feliz'}, 
					{word : 'Bom'}
				], 
				stimulusCss : {color:'#0000FF','font-size':'2em'}
			},	
			attribute2 : 
			{
				name : 'Desagradável', 
				title : {
					media : {word : 'Desagradável'}, 
					css : {color:'#0000FF','font-size':'1.8em'}, 
					height : 4,
					startStimulus : {
						media : {word : 'Horrível, Mal, Ruim, Péssimo'}, 
						css : {color:'#0000FF','font-size':'1em'}, 
						height : 2
					}
				}, 
				stimulusMedia : [ 
					{word : 'Horrível'}, 
					{word : 'Mal'}, 
					{word : 'Ruim'}, 
					{word : 'Péssimo'}
				], 
				stimulusCss : {color:'#0000FF','font-size':'2em'} 
			},
			base_url : {//Onde suas imagens estão hospedadas?
			image : 'https://baranan.github.io/minno-tasks/images/'
			},

			//practiceTrials são as tentativas no início da tarefa (Sriram & Greenwald recomendam 2 para cada categoria).
			practiceTrials : //Define o número de tentativas por grupo nos blocos de prática
			{//Pode definir 0 para todos se quiser remover as tentativas práticas.
				nFocalCat : 2, //Número de tentativas para a categoria focal.
				nNonFocalCats : 2, //Número de tentativas para cada categoria não focal. (em um mini bloco).
				nFocalAtt : 0, //Número de tentativas para o atributo focal (em um mini bloco).
				nNonFocalAtt : 0 //Número de tentativas para o atributo não focal (em um mini bloco). 
			},

			//Em cada bloco, podemos incluir um número de mini-blocos para reduzir repetição.
			nMiniBlocks : 1, //Defina como 1 se não precisar de mini blocos. 0 vai quebrar a tarefa.
			nTrialsPerMiniBlock : 16, //50% direita, 50% esquerda, 50% atributos, 50% categorias.

			//Define se usamos um certo atributo focal ao longo da tarefa, ou ambos.
			focalAttribute : 'attribute1', // Aceita 'attribute1', 'attribute2' ou 'both' (ambos) 

			//Define qual atributo aparece primeiro. Irrelevante se focalAttributes não for 'both'. 
			firstFocalAttribute : 'random', //Aceita 'attribute1', 'attribute2' ou 'random'. 
			
			//Se deve iniciar com um bloco de prática.
			practiceBlock : true, 
			nPracticeBlockTrials : 8, //Deve ter no mínimo 8 tentativas.

			//Número de blocos por combinação de categoria-atributo focal.
			nCategoryAttributeBlocks : 4, 

			//Se deve alternar o atributo focal apenas uma vez na tarefa (após todos os blocos do primeiro atributo), 
			//Ou após cada exaustão de todas as combinações (relevante apenas quando > 1).
			switchFocalAttributeOnce : true, 

			//focalCategoryOrder pode ser: 'bySequence' (sequencial) ou 'random' (aleatório).
			focalCategoryOrder : 'random', 
			
			//Se deve mostrar os estímulos de categorias focalizadas no começo do bloco.
			showStimuliWithInst : true, 
			
			//Lembrar o que fazer em caso de erro, durante toda a tarefa
			remindError : true, 
			
			//Localização do feedback de erro (a partir da base)
			errorBottom : 5, 
			
			remindErrorText : '<p align="center" style="font-size:"0.6em"; font-family:arial">' + 
			'Se cometer um erro, um <font color="#ff0000"><b>X</b></font> vermelho aparecerá. ' + 
			'Pressione a outra tecla para continuar.<p/>',
	        remindErrorTextTouch : '<p align="center" style="font-size:"1.4em"; font-family:arial">' +
			'Se cometer um erro, um <font color="#ff0000"><b>X</b></font> vermelho aparecerá. ' +
			'Toque no outro lado para continuar.<p/>',				
			
			ITIDuration : 250, //Duração entre tentativas.
            fontColor : '#000000', //Cor padrão usada nas mensagens impressas.
			
			//Texto e estilo das instruções de tecla exibidas junto aos rótulos de categoria.
			leftKeyText : '"E" para os demais', 
			rightKeyText : '"I" se pertencer', 
			keysCss : {'font-size':'0.8em', 'font-family':'courier', color:'#000000'},
			rightKeyTextTouch : 'Esquerda para os demais', 
			leftKeyTextTouch : 'Direita se pertencer', 
			//Texto e estilo do separador entre os rótulos de cima e de baixo.
			orText : 'ou', 
			orCss : {'font-size':'1.8em', color:'#000000'},
			
			instWidth : 99, //A largura do estímulo de instruções
			
			finalText : 'Pressione espaço para continuar para a próxima tarefa', 
			finalTouchText : 'Toque na área verde inferior para continuar',

			touchMaxStimulusWidth : '50%', 
			touchMaxStimulusHeight : '50%', 
			bottomTouchCss: {              
                        height: '20%'
                    }, //Adicione qualquer valor CSS desejado para a área de toque inferior.
			
			//Este é o template HTML para as instruções da tarefa. 
			// Algumas variáveis serão substituídas por seus valores: blockNum, nBlocks, focalAtt, focalCat.
			instTemplate: '<div><p align="center" style="font-size:20px; font-family:arial"><br/>' +
				'<font color="#000000"><u>Parte blockNum de nBlocks </u><br/><br/></p>' + 
				'<p style="font-size:20px; text-align:left; vertical-align:bottom; margin-left:10px; font-family:arial">' +
				'Coloque o dedo direito na tecla <b>I</b> para itens que pertencem à categoria ' + 
				'<font color="#0000FF">focalAtt</font>, ' + 
				'e para itens que pertencem à categoria <font color="#31b404">focalCat</font>.<br/>' + 
				'Coloque o dedo esquerdo na tecla <b>E</b> para itens que não pertencem a essas categorias.<br/><br/>' + 
				'Se cometer um erro, um <font color="#ff0000"><b>X</b></font> vermelho aparecerá. ' + 
				'Pressione a outra tecla para continuar.<br/><br/>' + 
				'<p align="center">Pressione a <b>barra de espaço</b> quando estiver pronto para começar.</font></p></div>', 
            instTemplateTouch: '<div><p align="center" ' +
				'<br/><font color="#000000"><u>Parte blockNum de nBlocks </u><br/></p>' + 
				'<p align="left" style="margin-left:5px"> ' +
				'Coloque o dedo direito na área verde <b>direita</b> para itens que pertencem à categoria ' + 
				'<font color="#0000FF">focalAtt</font>, ' + 
				'e para itens que pertencem à categoria <font color="#31b404">focalCat</font>.<br/>' + 
				'Coloque o dedo esquerdo na área verde <b>esquerda</b> para itens que não pertencem a essas categorias.<br/>' + 
				'Se cometer um erro, um <font color="#ff0000"><b>X</b></font> vermelho aparecerá. ' + 
				'Pressione a outra tecla para continuar.<br/>' + 
				'<p align="center">Toque na área verde <b>inferior</b> para começar.</font></p></div>', 				
			
			//Mensagens de feedback padrão para cada limite de pontuação.
			//CATEGORYA e CATEGORYB serão substituídas pelos nomes das respectivas categorias.
			fb_strong_Att1WithCatA_Att2WithCatB : 'Seus dados sugerem forte preferência por CATEGORYA em vez de CATEGORYB.',
			fb_moderate_Att1WithCatA_Att2WithCatB : 'Seus dados sugerem moderada preferência por CATEGORYA em vez de CATEGORYB.',
			fb_slight_Att1WithCatA_Att2WithCatB : 'Seus dados sugerem leve preferência por CATEGORYA em vez de CATEGORYB.',
			fb_equal_CatAvsCatB : 'Seus dados não sugerem preferência entre CATEGORYA e CATEGORYB.',
			//Feedback separado para cada CATEGORY.
			fb_strongAssociationForCatWithAtt1 : 'Seus dados sugerem forte avaliação automática positiva de CATEGORY.',
			fb_moderateAssociationForCatWithAtt1 : 'Seus dados sugerem moderada avaliação automática positiva de CATEGORY.',
			fb_slightAssociationForCatWithAtt1 : 'Seus dados sugerem leve avaliação automática positiva de CATEGORY.',
			fb_equalAssociationForCatWithAtts : 'Seus dados sugerem avaliação automática neutra de CATEGORY.',
			fb_strongAssociationForCatWithAtt2 : 'Seus dados sugerem forte avaliação automática negativa de CATEGORY.',
			fb_moderateAssociationForCatWithAtt2 : 'Seus dados sugerem moderada avaliação automática negativa de CATEGORY.',
			fb_slightAssociationForCatWithAtt2 : 'Seus dados sugerem leve avaliação automática negativa de CATEGORY.',
			
			//Mensagens de erro no feedback
			manyErrors: 'Houve muitos erros cometidos para determinar um resultado.',
			tooFast: 'Houve tentativas rápidas demais para determinar um resultado.',
			notEnough: 'Não houve tentativas suficientes para determinar um resultado.'
		};
		
		_.extend(piCurrent, _.defaults(options, batObj));
		_.extend(API.script.settings, options.settings);
		
        API.addSettings('onEnd', window.minnoJS.onEnd);

        API.addSettings('logger', {
            onRow: function(logName, log, settings, ctx){
                if (!ctx.logs) ctx.logs = [];
                ctx.logs.push(log);
            },
            onEnd: function(name, settings, ctx){
                return ctx.logs;
            },
            serialize: function (name, logs) {
                var headers = ['block', 'trial', 'cond', 'type', 'cat',  'stim', 'resp', 'err', 'rt', 'fb'];
                var myLogs = [];
                var iLog;
                for (iLog = 0; iLog < logs.length; iLog++)
                {
                    if(!hasProperties(logs[iLog], ['trial_id', 'name', 'responseHandle', 'stimuli', 'media', 'latency'])){}
                    else if(!hasProperties(logs[iLog].data, ['block', 'condition', 'score'])){}
                    else
                    {
                        myLogs.push(logs[iLog]);
                    }
                }
                var content = myLogs.map(function (log) { 
                    return [
                        log.data.block, 
                        log.trial_id, 
                        log.data.condition, 
                        log.name, 
                        log.stimuli[0], 
                        log.media[0], 
                        log.responseHandle, 
                        log.data.score, 
                        log.latency, 
                        '' 
                        ]; });
                content.push([9, 999, 'end', '', '', '', '', '', '', piCurrent.feedback]);
                        
                content.unshift(headers);
                return toCsv(content);

                function hasProperties(obj, props) {
                    var iProp;
                    for (iProp = 0; iProp < props.length; iProp++)
                    {
                        if (!obj.hasOwnProperty(props[iProp]))
                        {
                            return false;
                        }
                    }
                    return true;
                }
                function toCsv(matrice) { return matrice.map(buildRow).join('\n'); }
                function buildRow(arr) { return arr.map(normalize).join(','); }
                function normalize(val) {
                    var quotableRgx = /(\n|,|")/;
                    if (quotableRgx.test(val)) return '"' + val.replace(/"/g, '""') + '"';
                    return val;
                }
            },
            send: function(name, serialized){
                window.minnoJS.logger(serialized);
            }
        });
		var isTouch = piCurrent.isTouch;
		var attribute1 = piCurrent.attribute1;
		var attribute2 = piCurrent.attribute2;
		var cats = piCurrent.categories;

		API.addSettings('canvas',piCurrent.canvas);
		API.addSettings('base_url',piCurrent.base_url);
	    var leftInput = !isTouch ? {handle:'left',on:'keypressed',key:'e'} : {handle:'left',on:'click', stimHandle:'left'};
		var rightInput = !isTouch ? {handle:'right',on:'keypressed',key:'i'} : {handle:'right',on:'click', stimHandle:'right'};
		var proceedInput = !isTouch ? {handle:'space',on:'space'} : {handle:'space',on:'bottomTouch', css:piCurrent.bottomTouchCss};
		
		API.addTrialSets('sort',{
			data: {score:0, parcel:'first'}, 
			input: [
				{handle:'skip1',on:'keypressed', key:27}, 
				leftInput,
				rightInput
			],

			interactions: [
				{
					conditions: [{type:'begin'}],
					actions: [{type:'showStim',handle:'targetStim'}]
				},
				{
					conditions: [
						{type:'inputEqualsTrial', property:'corResp',negate:true}, 
						{type:'inputEquals',value:['right','left']}	
					],
					actions: [
						{type:'showStim',handle:'error'},	
						{type:'setTrialAttr', setter:{score:1}}	
					]
				},
				{
					conditions: [{type:'inputEqualsTrial', property:'corResp'}],	
					actions: [
						{type:'removeInput',handle:['left','right']}, 
						{type:'hideStim', handle: 'All'},											
						{type:'log'},																
						{type:'setInput',input:{handle:'end', on:'timeout',duration:piCurrent.ITIDuration}} 
					]
				},
				{
					conditions: [{type:'inputEquals',value:'end'}],
					actions: [
						{type:'endTrial'}
					]
				},
				{
					conditions: [{type:'inputEquals',value:'skip1'}],
					actions: [
						{type:'setInput',input:{handle:'skip2', on:'enter'}} 
					]
				},
				{
					conditions: [{type:'inputEquals',value:'skip2'}],
					actions: [
						{type:'goto', destination: 'nextWhere', properties: {blockStart:true}},
						{type:'endTrial'}
					]
				}
			]
		});

		API.addTrialSets('instructions', [
			{
				data: {blockStart:true, condition:'instructions', score:0, block:0},
				input: [
					proceedInput
				],

				interactions: [
					{
						conditions: [{type:'begin'}],
						actions: [
							{type:'showStim',handle:'All'}
						]
					},
					{
						conditions: [{type:'inputEquals',value:'space'}],
						actions: [
							{type:'hideStim', handle:'All'},
							{type:'trigger', handle:'endTrial', duration:500}
						]
					},
					{
						conditions: [{type:'inputEquals',value:'endTrial'}],
						actions: [{type:'endTrial'}]
					}
				]
			}
		]);

		function createBasicTrialSet(params)
		{
			var set = [{
				inherit : 'sort', 
				data : {corResp : params.side},
				stimuli : 
				[
					{inherit:{type:'exRandom',set:params.stimSet}},
					{inherit:{set:'error'}}
				]
			}];
			return set;
		}
		
		var basicTrialSets = {};
		for (var iTrialType = 0; iTrialType < cats.length; iTrialType++)
		{
			basicTrialSets['category'+ (iTrialType+1) + 'left'] = 
				createBasicTrialSet({side:'left', stimSet: 'category'+(iTrialType+1)});
			basicTrialSets['category'+ (iTrialType+1) + 'right'] = 
				createBasicTrialSet({side:'right', stimSet: 'category'+(iTrialType+1)});
		}
		basicTrialSets.attribute1left = 
			createBasicTrialSet({side:'left', stimSet: 'attribute1'});
		basicTrialSets.attribute1right = 
			createBasicTrialSet({side:'right', stimSet: 'attribute1'});
		basicTrialSets.attribute2left = 
			createBasicTrialSet({side:'left', stimSet: 'attribute2'});
		basicTrialSets.attribute2right = 
			createBasicTrialSet({side:'right', stimSet: 'attribute2'});
			
		if (piCurrent.practiceBlock)
		{
			basicTrialSets.practiceCat1 = 
				createBasicTrialSet({side:'right', stimSet: 'practiceCat1'});
			basicTrialSets.practiceCat2 = 
				createBasicTrialSet({side:'left', stimSet: 'practiceCat2'});
			basicTrialSets.practiceCats = 
			[
				{inherit:{set:'practiceCat1', type:'exRandom'}}, 
				{inherit:{set:'practiceCat2', type:'exRandom'}}
			];
		}

		API.addTrialSets(basicTrialSets);

		API.addStimulusSets({
			Default: [
				{css:{color:'black','font-size':'2em'}}
			],

			instructions: [
				{css:{'font-size':'1.3em',color:'black', lineHeight:1.2}}
			],

			attribute1 : 
			[{
				data: {alias:attribute1.name, handle:'targetStim'}, 
				inherit : 'Default', 
				css:attribute1.stimulusCss,
				media : {inherit:{type:'exRandom',set:'attribute1'}}
			}],
			attribute2 : 
			[{
				data: {alias:attribute2.name, handle:'targetStim'}, 
				inherit : 'Default', 
				css:attribute2.stimulusCss,
				media : {inherit:{type:'exRandom',set:'attribute2'}}
			}],		
			practiceCat1 : 
			[{
				data: {alias:piCurrent.practiceCategory1.name, handle:'targetStim'}, 
				inherit : 'Default', 
				css:piCurrent.practiceCategory1.stimulusCss,
				media : {inherit:{type:'exRandom',set:'practiceCat1'}}
			}],
			practiceCat2 : 
			[{
				data: {alias:piCurrent.practiceCategory2.name, handle:'targetStim'}, 
				inherit : 'Default', 
				css:piCurrent.practiceCategory2.stimulusCss,
				media : {inherit:{type:'exRandom',set:'practiceCat2'}}
			}],	
			touchInputStimuli: [
				{media:{html:'<div></div>'}, size:{height:48,width:30},css:{background:'#00FF00', opacity:0.3, zindex:-1}, location:{right:0}, data:{handle:'right'}},
				{media:{html:'<div></div>'}, size:{height:48,width:30},css:{background:'#00FF00', opacity:0.3, zindex:-1}, location:{left:0}, data:{handle:'left'}}
			],	
			error : [{
				handle:'error', location: {bottom: piCurrent.errorBottom}, css:{color:'red','font-size':'4em'}, media: {word:'X'}, nolog:true
			}]
		});
		
		var catStimulusSets = {};
		var iCatStim;
		for (iCatStim = 0; iCatStim < cats.length; iCatStim++)
		{
			catStimulusSets['category'+(iCatStim+1)] = 
			[{
				data: {alias:cats[iCatStim].name, handle:'targetStim'}, 
				inherit : 'Default', 
				css:cats[iCatStim].stimulusCss,
				media : {inherit:{type:'exRandom',set:'category'+(iCatStim+1)}}
			}];
		}
		API.addStimulusSets(catStimulusSets);
		
		API.addMediaSets({
			attribute1 : attribute1.stimulusMedia,
			attribute2 : attribute2.stimulusMedia, 
			practiceCat1 : piCurrent.practiceCategory1.stimulusMedia,
			practiceCat2 : piCurrent.practiceCategory2.stimulusMedia
		});
		
		var catMediaSets = {};
		var iCatMedia;
		for (iCatMedia = 0; iCatMedia < cats.length; iCatMedia++)
		{
			catMediaSets['category'+(iCatMedia+1)] = cats[iCatMedia].stimulusMedia;
		}
		API.addMediaSets(catMediaSets);

		function getInstFromTemplate(params)
		{
			var retText = params.instTemplate.replace(/focalAtt/g, params.focalAttName);
			retText = retText.replace(/focalCat/g, params.focalCatName);
			retText = retText.replace(/blockNum/g, params.blockNum);
			retText = retText.replace(/nBlocks/g, params.nBlocks);
			return (retText);
		}
		
		function getLayout(params)
		{
		    var leftText = { word:piCurrent.leftKeyText };
		    var rightText = { word:piCurrent.rightKeyText };
    		if (params.isTouch)
    		{
    		    leftText = { word:piCurrent.leftKeyTextTouch };
    		    rightText = { word:piCurrent.rightKeyTextTouch };
    		}
			var layout = [
				{
				    location:{left:6,top:1}, media:leftText, 
				    css:piCurrent.keysCss,
				    isTouch: isTouch
				},
				{
				    location:{right:6,top:1}, 
				    media:rightText, 
				    css:piCurrent.keysCss,
				    isTouch: isTouch
				}, 
				{
				    location:{top:1}, 
				    media : params.focalCatTitle.media, 
				    css: params.focalCatTitle.css, 
				    isTouch: isTouch
				}
			];
            if (!params.isInst && params.isTouch){
				layout.push({inherit:{type:'byData', set:'touchInputStimuli', data:{handle:'right'}}});
				layout.push({inherit:{type:'byData', set:'touchInputStimuli', data:{handle:'left'}}});
			}			
			if (params.showStimuliWithInst && params.isInst)
			{
				layout = layout.concat([				
					{location:{top:1 + (params.focalCatTitle.height | 3)},
						media:params.focalCatTitle.startStimulus.media, css:params.focalCatTitle.startStimulus.css}, 
					{location:{top:1 + (params.focalCatTitle.height | 3) + (params.focalCatTitle.startStimulus.height | 3)},
						media:{word:'e'}, css:{color:'#000000','font-size':'1.8em'}}, 
					{location:{top:5 + 1 + (params.focalCatTitle.height | 3) + (params.focalCatTitle.startStimulus.height | 3)}, 
					media : params.focalAttTitle.media, css: params.focalAttTitle.css},
					{location:{top:5 + 1 + (params.focalCatTitle.height | 3) + (params.focalCatTitle.startStimulus.height | 3) + (params.focalAttTitle.height | 3)}, 
					media : params.focalAttTitle.startStimulus.media, css: params.focalAttTitle.startStimulus.css}
				]); 
			}
			else
			{
				layout = layout.concat([
					{location:{top:1+ (params.focalCatTitle.height | 3)},
						media:{word:'e'}, css:{color:'#000000','font-size':'1.8em'}}, 
					{location:{top:7 + (params.focalCatTitle.height | 3)}, 
					media : params.focalAttTitle.media, css: params.focalAttTitle.css}
				]); 
			}
			
			if (!params.isInst && params.remindError)
			{
    			var htmlText={html: params.remindErrorText};
			    if(params.isTouch)
			    {
			        htmlText={html: params.remindErrorTextTouch};
			    }
				layout.push({
					location:{bottom:1}, css: {color:'#000000','font-size':'1em'}, 
					media : htmlText
				});
			}

			return layout;
		}
		
		function getBlockLayout(params)
		{
			var focalAttTitle = attribute1.title;
			if (params.focalAtt == 'attribute2')
			{
				focalAttTitle = attribute2.title;
			}
			
			return getLayout({
				focalCatTitle : params.focalCatTitle, 
				focalAttTitle : focalAttTitle, 
				showStimuliWithInst : params.showStimuliWithInst, isInst : params.isInst, 
				remindError : params.remindError, remindErrorText : params.remindErrorText, remindErrorTextTouch : params.remindErrorTextTouch, isTouch:params.isTouch}); 
		}
		
		function getInstTrial(params)
		{
			params.focalAttName = (params.focalAtt == 'attribute2') ? attribute2.name : attribute1.name;
			
			var instParams = {isInst : true};
			_.extend(instParams, params);
			
			var instTrial = {
				inherit : 'instructions', 
				data: {blockStart:true},
				layout : getBlockLayout(instParams), 
				stimuli : [
					{ 
						inherit : 'instructions', 
						media : {html : getInstFromTemplate(params)}, 
						location : {bottom:1}
					}
				]
			};
			return instTrial;
		}
		
		function getCondition(params)
		{
			var focalAttName = (params.focalAtt == 'attribute1') ? 
				attribute1.name : attribute2.name;
			var focalCatName = cats[params.focalCatIndex-1].name;
			var condition = focalCatName + '/' + focalAttName;
			return condition;
		}
		
		function getPracticeTrialsMixer(params)
		{
			var blockLayout = getBlockLayout(params);
			var nonFocalAtt = (params.focalAtt == 'attribute1') ? 'attribute2' : 'attribute1';
			var blockData = {block : params.blockNum, condition : getCondition(params) + '_practice'};

			var theMixerData = [
				{
					mixer : 'repeat', 
					times : params.practiceTrials.nFocalCat, 
					data : [
						{
							inherit : 'category'+ params.focalCatIndex + 'right', 
							data : blockData, layout : blockLayout
						}
					]
				}, 
				{
					mixer : 'repeat', 
					times : params.practiceTrials.nFocalAtt, 
					data : [
						{
							inherit : params.focalAtt + 'right', 
							data : blockData, layout : blockLayout
						}
					]
				}, 
				{
					mixer : 'repeat', 
					times : params.practiceTrials.nNonFocalAtt, 
					data : [
						{
							inherit : nonFocalAtt + 'left',  
							data : blockData, layout : blockLayout
						}
					]
				}
			];
			var iCatNonFocal;
			for (iCatNonFocal = 1; iCatNonFocal <= cats.length; iCatNonFocal++)
			{
				if (iCatNonFocal != params.focalCatIndex)
				{
					theMixerData.push({
						mixer : 'repeat', 
						times : params.practiceTrials.nNonFocalCats, 
						data : [
							{
								inherit : 'category' + iCatNonFocal + 'left', 
								data : blockData, layout : blockLayout
							}
						]
					});
				}
			}
			
			var theMixer = {
				mixer : 'random', 
				data : theMixerData
			};
			
			return theMixer;
		}
		
		function getBlockMixer(params)
		{
			var blockLayout = getBlockLayout(params);

			var blockData = {block : params.blockNum, condition : getCondition(params) };

			var mixerData = [];
			for (var iMini = 0; iMini < params.nMiniBlocks; iMini++)
			{
				var attSequence = [];
				var catSequence = [];
				var iCatMini = 1;
				for (var iTimes = 0; iTimes < params.nTrialsPerMiniBlock/4; iTimes++)
				{
					attSequence.push(1);
					attSequence.push(2);
					catSequence.push(params.focalCatIndex); 
					var otherCat = 0;
					for (var iIters = 0; iIters < 50 && otherCat === 0; iIters++)
					{
						if (iCatMini > params.nCats)
						{
							iCatMini = 1;
						}
						if (iCatMini == params.focalCatIndex)
						{
							iCatMini++;
						}
						else
						{
							otherCat = iCatMini;
						}
					}
					catSequence.push(otherCat); 
				}
				attSequence = _.shuffle(attSequence);
				catSequence = _.shuffle(catSequence);
				for (var iTrial = 0; iTrial < params.nTrialsPerMiniBlock/2; iTrial++)
				{
					var att = 'attribute' + attSequence.pop();
					var attSide = (att == params.focalAtt) ? 'right' : 'left';
					mixerData.push({
						inherit : att + attSide, 
							data : blockData, layout : blockLayout
					});
					var cat = catSequence.pop();
					var catSide = (cat == params.focalCatIndex) ? 'right' : 'left';
					mixerData.push({
						inherit : 'category' + cat + catSide, 
							data : blockData, layout : blockLayout
					});
				}
			}
			
			var theMixer = {
				mixer : 'wrapper',
				data : mixerData
			};
			
			return theMixer;
		}
		function getPracBlockMixer(params)
		{
			var blockLayout = getBlockLayout(params);

			var blockData = {block : params.blockNum, condition : "practiceBlock" };

			var mixer = 
			{
				mixer : 'repeat', 
				times : piCurrent.nPracticeBlockTrials/2, 
				data : [						
					{inherit:{set:'practiceCats', type:'exRandom'}, data:blockData, layout : blockLayout}, 
					{inherit:{set:'practiceAtts', type:'exRandom'}, data:blockData, layout : blockLayout}
				]
			};
			
			return mixer;
		}

		var trialSequence = [];
		
		var nBlocks = cats.length * piCurrent.nCategoryAttributeBlocks; 
		var focalAttribute = piCurrent.focalAttribute;
		if (focalAttribute == 'both')
		{
			nBlocks = nBlocks*2; 
			focalAttribute = piCurrent.firstFocalAttribute;
			if (focalAttribute == 'random')
			{
				focalAttribute = (Math.random() < 0.5) ? 'attribute1' : 'attribute2';
			}
		}

		var iBlock = 1;
		var instTemplateVar;

		if (piCurrent.practiceBlock)
		{
			nBlocks++;
			instTemplateVar = isTouch ? piCurrent.instTemplateTouch : piCurrent.instTemplate;
			var pracParams = {
				 instTemplate: instTemplateVar, 
				focalAtt:focalAttribute, 
				focalCatName:piCurrent.practiceCategory1.name, 
				focalCatTitle:piCurrent.practiceCategory1.title, 
				nBlocks : nBlocks, 
				showStimuliWithInst : piCurrent.showStimuliWithInst, 
				remindError : piCurrent.remindError, 
				remindErrorText : piCurrent.remindErrorText, 
				remindErrorTextTouch : piCurrent.remindErrorTextTouch, 
				isTouch: piCurrent.isTouch,
				blockNum:1
			};
			trialSequence.push(getInstTrial(pracParams));
			var nonFocalAttribute = (focalAttribute == 'attribute1' ? 'attribute2' : 'attribute1');
			API.addTrialSets('practiceAtts', 
			[
				{inherit : {set:focalAttribute + 'right', type:'exRandom'}}, 
				{inherit : {set:nonFocalAttribute + 'left', type:'exRandom'}}
			]);
			trialSequence.push(getPracBlockMixer(pracParams));
			iBlock++;
		}
		
		var categoryOrder = [];
		var iCatOrder;
		for (iCatOrder = 1; iCatOrder <= cats.length; iCatOrder++)
		{
			categoryOrder.push(iCatOrder);
		}
		if (piCurrent.focalCategoryOrder == 'random')
		{
			categoryOrder = _.shuffle(categoryOrder);
		}
		instTemplateVar = isTouch ? piCurrent.instTemplateTouch : piCurrent.instTemplate;
		var blockParams = {
			instTemplate: instTemplateVar, 
			focalAtt:focalAttribute, 
			practiceTrials : piCurrent.practiceTrials, 
			nMiniBlocks : piCurrent.nMiniBlocks, 
			nTrialsPerMiniBlock : piCurrent.nTrialsPerMiniBlock,
			nCats : cats.length,
			nBlocks : nBlocks, 
			showStimuliWithInst : piCurrent.showStimuliWithInst, 
			remindError : piCurrent.remindError, 
			remindErrorText : piCurrent.remindErrorText,
			remindErrorTextTouch : piCurrent.remindErrorTextTouch, 
			isTouch: piCurrent.isTouch
		};
		var iCycle1Att;
		for (iCycle1Att = 0; iCycle1Att < piCurrent.nCategoryAttributeBlocks; iCycle1Att++)
		{
			var iCatBlocks;
			for (iCatBlocks = 0; iCatBlocks < cats.length; iCatBlocks++)
			{
				var curBlockParams1 = _.extend(blockParams, 
						{blockNum:iBlock, focalCatIndex:categoryOrder[iCatBlocks], 
						focalCatName:cats[categoryOrder[iCatBlocks]-1].name, 
						focalCatTitle:cats[categoryOrder[iCatBlocks]-1].title});
				trialSequence.push(getInstTrial(curBlockParams1));
				trialSequence.push(getPracticeTrialsMixer(curBlockParams1));
				trialSequence.push(getBlockMixer(curBlockParams1));
				iBlock++;
			}
			if (!piCurrent.switchFocalAttributeOnce && 
				piCurrent.focalAttribute == 'both')
			{
				focalAttribute = (focalAttribute == 'attribute1') ? 'attribute2' : 'attribute1';
				blockParams.focalAtt = focalAttribute;
				var iCatBlocks2;
				for (iCatBlocks2 = 0; iCatBlocks2 < cats.length; iCatBlocks2++)
				{
					var curBlockParams2 = _.extend(blockParams, 
						{blockNum:iBlock, focalCatIndex:categoryOrder[iCatBlocks2], 
						focalCatName:cats[categoryOrder[iCatBlocks2]-1].name, 
						focalCatTitle:cats[categoryOrder[iCatBlocks2]-1].title});
						trialSequence.push(getInstTrial(curBlockParams2));
						trialSequence.push(getPracticeTrialsMixer(curBlockParams2));
						trialSequence.push(getBlockMixer(curBlockParams2));
						iBlock++;
				}
				focalAttribute = (focalAttribute == 'attribute1') ? 'attribute2' : 'attribute1';
			}
		}

		if (piCurrent.switchFocalAttributeOnce && 
			piCurrent.focalAttribute == 'both')
		{
			focalAttribute = (focalAttribute == 'attribute1') ? 'attribute2' : 'attribute1';
			blockParams.focalAtt = focalAttribute;
			var iCycle2Att;
			for (iCycle2Att = 0; iCycle2Att < piCurrent.nCategoryAttributeBlocks; iCycle2Att++)
			{
				var iCat2Att;
				for (iCat2Att = 0; iCat2Att < cats.length; iCat2Att++)
				{
					var curBlockParams3 = _.extend(blockParams, 
						{blockNum:iBlock, focalCatIndex:categoryOrder[iCat2Att], 
						focalCatName:cats[categoryOrder[iCat2Att]-1].name, 
						focalCatTitle:cats[categoryOrder[iCat2Att]-1].title});
					trialSequence.push(getInstTrial(curBlockParams3));
					trialSequence.push(getPracticeTrialsMixer(curBlockParams3));
					trialSequence.push(getBlockMixer(curBlockParams3));
					iBlock++;
				}
			}
		}
		
		trialSequence.push({
			inherit : 'instructions',
			data: {blockStart:true},
			layout : [{media:{word:''}}], 
			stimuli : [
				{ 
					inherit : 'Default', 
					media : {word : (isTouch ? piCurrent.finalTouchText : piCurrent.finalText)}
				}
			]
		});
		
		API.addSequence(trialSequence);
		
		function computeSingleCatFB(inCatIndex)
		{
			var catName = cats[inCatIndex].name;
			var cond1VarValues = [catName + '/' + attribute2.name];
			var cond2VarValues = [catName + '/' + attribute1.name];
			var iCatScore;
			for (iCatScore = 0; iCatScore < cats.length; iCatScore++)
			{
				if (iCatScore != inCatIndex)
				{
					cond1VarValues.push(cats[iCatScore].name + '/' + attribute1.name);
					cond2VarValues.push(cats[iCatScore].name + '/' + attribute2.name);
				}
			}		
		
			scorer.addSettings('compute',{
				ErrorVar:'score',
				condVar:"condition",
				cond1VarValues: cond1VarValues, 
				cond2VarValues: cond2VarValues, 
				fastRT : 150, 
				maxFastTrialsRate : 0.1, 
				minRT : 400, 
				maxRT : 2000, 
				errorLatency : {use:"latency", penalty:600, useForSTD:true},
				postSettings : {score: "score", msg:"feeedback", url:"/implicit/scorer"}
			});

			var scoreObj = {	
				MessageDef : [
					{ cut:'-0.65', message:piCurrent.fb_strongAssociationForCatWithAtt2}, 
					{ cut:'-0.35', message:piCurrent.fb_moderateAssociationForCatWithAtt2 },
					{ cut:'-0.15', message:piCurrent.fb_slightAssociationForCatWithAtt2 },
					{ cut:'0.15', message:piCurrent.fb_equalAssociationForCatWithAtts},
					{ cut:'0.35', message:piCurrent.fb_slightAssociationForCatWithAtt1},
					{ cut:'0.65', message:piCurrent.fb_moderateAssociationForCatWithAtt1 },
					{ cut:'105', message:piCurrent.fb_strongAssociationForCatWithAtt1 }
				],
				manyErrors : piCurrent.manyErrors,
				tooFast : piCurrent.tooFast,
				notEnough : piCurrent.notEnough
			};
			
			for (var iCut = 0; iCut < scoreObj.MessageDef.length; iCut++)
			{
				var tmp = scoreObj.MessageDef[iCut].message.replace(/CATEGORY/g, catName);
				tmp = tmp.replace(/attribute1/g, attribute1.name);
				tmp = tmp.replace(/attribute2/g, attribute2.name);
				scoreObj.MessageDef[iCut].message = tmp;
			}
			
			scorer.addSettings('message',scoreObj);
			
			var scored = scorer.computeD();
			
			scored.problem = (
				scored.FBMsg == piCurrent.manyErrors || 
				scored.FBMsg == piCurrent.tooFast || 
				scored.FBMsg == piCurrent.notEnough);
			
			return (scored);
		}
		
		function getPreferenceMessage(params)
		{
		
			var diffScore = (params.score2 - params.score1) / 2;

			var messageDefs = [
				{cutoff : -0.65, message : piCurrent.fb_strong_Att1WithCatA_Att2WithCatB}, 
				{cutoff : -0.35, message : piCurrent.fb_moderate_Att1WithCatA_Att2WithCatB}, 
				{cutoff : -0.15, message : piCurrent.fb_slight_Att1WithCatA_Att2WithCatB}, 
				{cutoff : 0.15, message : piCurrent.fb_equal_CatAvsCatB}, 
				{cutoff : 0.35, message : piCurrent.fb_slight_Att1WithCatA_Att2WithCatB}, 
				{cutoff : 0.65, message : piCurrent.fb_moderate_Att1WithCatA_Att2WithCatB}, 
				{cutoff : 1000, message : piCurrent.fb_strong_Att1WithCatA_Att2WithCatB}
			];
			
			var fbMsg = '';
			for (var iCut = 0; iCut < messageDefs.length && fbMsg === ''; iCut++)
			{
				if (diffScore < messageDefs[iCut].cutoff)
				{
					fbMsg = messageDefs[iCut].message;
					if (messageDefs[iCut].cutoff < 0)
					{
						fbMsg = fbMsg.replace(/CATEGORYA/g, params.name1);
						fbMsg = fbMsg.replace(/CATEGORYB/g, params.name2);
					}
					else
					{
						fbMsg = fbMsg.replace(/CATEGORYA/g, params.name2);
						fbMsg = fbMsg.replace(/CATEGORYB/g, params.name1);
					}
					fbMsg = fbMsg.replace(/attribute1/g, attribute1.name);
					fbMsg = fbMsg.replace(/attribute2/g, attribute2.name);
				}
			}
			
			return({fb:fbMsg, score:diffScore});
		}
		
		API.addSettings('hooks',{
			endTask: function(){
				
				var scoreObj = {};

				var iCatEnd;
				for (iCatEnd = 0; iCatEnd < cats.length; iCatEnd++)
				{
					var tScoreObj = computeSingleCatFB(iCatEnd);
					scoreObj[cats[iCatEnd].name + '_FB'] = tScoreObj.FBMsg;
					scoreObj[cats[iCatEnd].name + '_score'] = tScoreObj.DScore;
					var iOtherCatEnd;
					for (iOtherCatEnd = 0; iOtherCatEnd < iCatEnd; iOtherCatEnd++) 
					{
						var prfObj = {};
						if (tScoreObj.problem)
						{
							prfObj = {fb : tScoreObj.FBMsg, score : -9};
						}
						else
						{
							prfObj = getPreferenceMessage({
									score1 : scoreObj[cats[iCatEnd].name + '_score'], 
									score2 : scoreObj[cats[iOtherCatEnd].name + '_score'], 
									name1 : cats[iCatEnd].name, 
									name2 : cats[iOtherCatEnd].name});
						}
						scoreObj[cats[iOtherCatEnd].name + '-versus-' + cats[iCatEnd].name + '_FB'] = prfObj.fb;
						scoreObj[cats[iOtherCatEnd].name + '-versus-' + cats[iCatEnd].name + '_score'] = prfObj.score;
					}
				}
				scoreObj.feedback = scoreObj[cats[0].name + '-versus-' + cats[1].name+ '_FB'];
				
				piCurrent.feedback = scoreObj.feedback;
				window.minnoJS.onEnd();

			}
		});
		
		return API.script;
	}
		
	return iatExtension;
});
