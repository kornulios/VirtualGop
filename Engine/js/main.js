// Крок 1: Основа бібліотеки
var App = App || {};
App.define = function (namespace) {
	var parts = namespace.split("."), current = App, i;
	if (parts[0] == "App") { parts = parts.slice(1); }	// убрать начальный префикс если это имя глобальной переменной
	for (i = 0; i < parts.length; i++) {
		if (typeof current[parts[i]] == "undefined") {	// если в глобальном объекте нет свойства - создать его.
			current[parts[i]] = {};
		}
		current = current[parts[i]];
	}
	return current;
}

// Крок 2: Створення і заповнення об’єкта-модуля бібліотеки
App.define("GApp.GEngine")
App.GApp.GEngine = (function () {
	function Location(code, name) {
		if (!(this instanceof Location)) { return new Location(code, name); }
		this.getCode = () => code;
		this.getName = () => name;
	}
	function LocationPath(code, loc1Code, loc2Code, name) {
		if (!(this instanceof LocationPath)) { return new LocationPath(code, loc1Code, loc2Code, name); }
		this.getCode = () => code;
		this.getName = () => name;
		this.getLoc1Code = () => loc1Code;
		this.getLoc2Code = () => loc2Code;
	}

	let _map;
	function GMap() {
		if (!(this instanceof GMap)) { return new GMap(); }
		if (typeof _map === "object") { return _map; }

		let _locations = [
			new Location('ml', "Метро Лесная"),				// ml		Метро Лісова			Метро Лесная				Metro Lisova		Вы пришли	Вы подошли	на,	в, к (если есть куда зайти)
			new Location('pk', "Парк Киото"),				// pk		Парк Кіото				Парк Киото					Park Kioto									
			new Location('kz', "Площадь перед козырьком"),	// kz		Площа перед козирьком	Площадь перед козырьком		Central square								
			new Location('ka', "Корпус А"),					// ka		Корпус А				Корпус А					Building A									
			new Location('kb', "Корпус Б"),					// kb		Корпус Б				Корпус Б					Building B									
			new Location('kv', "Корпус В"),					// kv		Корпус В				Корпус В					Building V
			new Location('ke', "Корпус E"),					// ke 		Корпус Е				Корпус E					Building E			?st Столовка
			new Location('kg', "Корпус Г"),					// kg		Корпус Г				Корпус Г					Building G
			new Location('da', "Doom-aлейка"),				// da		Doom-aлейка 			Doom-aлейка					Doom Avenue
			new Location('ss', "Спортзал и стадион"),		// ss		Спортзал і стадіон		Спортзал и стадион			Gym & Stadium
			new Location('o2', "Общага №2"),				// o2		Общага №2				Общага №2					Hostel N2			Гуртожиток №2
			new Location('o3', "Общага №3"),				// o3		Общага №3				Общага №3					Hostel N3			Гуртожиток №2
		];
		let _locationPathes = [
			new LocationPath(1, 'ml', 'pk', "Metro Lisova - Park Kioto"),
			new LocationPath(2, 'pk', 'kz', "Park Kioto - Central square"),
			new LocationPath(3, 'kz', 'ka', "Central square - Building A"),
			new LocationPath(4, 'kz', 'kv', "Central square - Building V"),

			new LocationPath(5, 'kz', 'kg', "Central square - Building G"),
			new LocationPath(6, 'kz', 'da', "Central square - Doom Avenue"),
			new LocationPath(7, 'kz', 'ss', "Central square - Gym & Stadium"),
			new LocationPath(8, 'kz', 'o2', "Central square - Hostel N2"),
			new LocationPath(9, 'kz', 'o3', "Central square - Hostel N3"),
			new LocationPath(10, 'ka', 'kb', "Building A - Building B"),

			new LocationPath(11, 'ka', 'kv', "Building A - Building V"),
			new LocationPath(12, 'ka', 'ke', "Building A - Building E"),
			new LocationPath(13, 'kb', 'kv', "Building B - Building V"),
			new LocationPath(14, 'kb', 'ke', "Building B - Building E"),
			new LocationPath(15, 'kv', 'ke', "Building V - Building E"),

			new LocationPath(16, 'kg', 'da', "Building G - Doom Avenue"),
			new LocationPath(17, 'kg', 'ss', "Building G - Gym & Stadium"),
			new LocationPath(18, 'kg', 'o2', "Building G - Hostel N2"),
			new LocationPath(19, 'kg', 'o3', "Building G - Hostel N3"),
			new LocationPath(20, 'da', 'ss', "Doom Avenue - Gym & Stadium"),

			new LocationPath(21, 'da', 'o2', "Doom Avenue - Hostel N2"),
			new LocationPath(22, 'da', 'o3', "Doom Avenue - Hostel N3"),
			new LocationPath(23, 'ss', 'o2', "Gym & Stadium - Hostel N2"),
			new LocationPath(24, 'ss', 'o3', "Gym & Stadium - Hostel N3"),
			new LocationPath(25, 'o2', 'o3', "Hostel N2 - Hostel N3"),
		];
		this.getLocations = () => _locations;				// не захищає від внесення змін всередину
		this.getLocationPathes = () => _locationPathes;		// не захищає від внесення змін всередину
		_map = this;
	}
	GMap.prototype.getNearbyLocPathes = function (code) {
		return this.getLocationPathes().filter((path) => (path.getLoc1Code() == code) || (path.getLoc2Code() == code));
	}
	GMap.prototype.findLocationPath = function (from, to) {
		return this.getLocationPathes().find(v => {
			let loc1 = v.getLoc1Code(),
				loc2 = v.getLoc2Code();
			if ((from === loc1 && to === loc2) || (from === loc2 && to === loc1)) { return true; }
		})
	};
	GMap.prototype.findLocation = function (code) {
		return this.getLocations().find(v => v.getCode() === code);
	}

	function GStoryteller() {
		if (!(this instanceof GStoryteller)) { return new GStoryteller(); }
	}
	GStoryteller.prototype.selectSentence = function (sentences) {
		// обробити ситуацію, коли sentences = пустий масив
		let i = Math.floor(Math.random() * sentences.length);
		return sentences[i];
	}
	GStoryteller.prototype.selectAddSentence = function (sentences, chance) {
		// обробити ситуацію, коли sentences = пустий масив
		let out = [],
			add = Math.random() <= chance,
			i;
		if (add) {
			i = Math.floor(Math.random() * sentences.length);
			out = sentences[i];
		}
		return out;
	}
	GStoryteller.prototype.describe = function (action, params) {
		let out = [];
		switch (action) {
			case "p_go_loc": {
				let { locFrom, locTo, sucess } = params,
					sentences = {
						"true": [
							// в-на, у, к, возле, перед 
							[`Ты пришел в ${locTo.getName()}`],
							[`Ты приперся к ${locTo.getName()}`],
							[`Ты поперся в ${locTo.getName()}`],
							[`Ты остановился возле ${locTo.getName()}`],
							[`Ты побрел в ${locTo.getName()}`],
							[`Тебя занесло в ${locTo.getName()}`],
						],
						"false": [
							[`Ты не можешь попасть в ${locTo.getName()} отсюда`]
						],
					},
					sentences_after = {
						"true": [
							// тут можна і універсальні фрази, які доповнюють будь-яке речення
							// голос за кадром може жартувати над гравцем
							[`Энергично осматриваясь вокруг, ты судорожно пытаешся вспомнить, зачем ты это сделал.`],
							[`Героически осматривая все вокруг, ты гордо вспоминаешь, как тебя здесь п_дили на 1-ом курсе. Да, а ведь были времена!`],
							[`Зачем - одному Богу известно.`],
							[`И зачем, умник?`],
							[`Что ты собираешся здесь делать?`],
							[`Хм, ты явно что-то задумал.`],
							[`Хм, ты явно собираешся здесь что-то cделать.`],
							[`Тебе захотелось в сортир. Но прошло.`],
							[`Мимо тебя прошел человек в костюме и кросовках.`],
							[`Рядом с тобой дважды прошел человек в костюме и кросовках. К чему бы это?`],
							[`Ты стоишь как супермен, разглядывая проходящих мимо тебя девушек.`],
							[`Ммм... Вон та, в беленьком  - очень неплохо...`],
							[`Ммм...`],
							[`Ты ущипнул за попку проходящую мимо девушку.`],
							[`Тебя ущипнула за попку проходящая мимо девушка.`],
							[`Тебе подмигнула красотка напротив.`],
							[`Ты заметил, что на тебя поглядывают две взрослые тетки.`],
							[`Услышав знакомый запах, ты аккуратно принюхался. Нет, похоже, это был не ты.`],
							[`Блин! Ты опять влез в жвачку! Вот подстава!`],
							[`Эй, дружище, можно тебя на два слова... - услышал ты справа от себя, и мастерски смешался с толпой.`],
							[`По-моему, вон один из 12-ой группы... - услышал ты слева от себя, и за полсекунды растворился в проходящих мимо.`],
							[`Слыш, пацан... - услышал ты позади себя, и моменально оказался значительно дальше, чем можно было представить.`],
							[`О, монетка! Пока ты наклонялся за ней, у тебя из кармана вытащили двадцатку.`],
							[`Слыш, а тебе не пора на пары?`],
							[`Тщательно выбрав место, ты незаметно приклеил на него жвачку.`],
							[`Слыш, а ты Горлача знаешь? Вот он... - донеслось до тебя из толпы, но веселая компания уже скрылась за поворотом.`],
						],
						"false": [
							[`Что тебе непонятно?`],
							[`Вот дурак.`],
							[`А в школе был отличником.`],
							[`Блин! Как так?`],
							[`А еще кибернетик.`],
						],
					},
					chance_after = 0.35,
					out_after = [];
				out = this.selectSentence(sentences[sucess.toString()]);
				if (chance_after > 0) {
					out_after = this.selectAddSentence(sentences_after[sucess.toString()], chance_after);
					out = out.concat(out_after);
				}
				break;
			}
			case "p_go_same": {
				let sentences = [
					[`Как думаешь, где ты сейчас?`],
					[`А ты сейчас где?`],
					[`Эйй, парень, соберись.`],
					[`Парень, соберись.`],
					[`Ты шутишь?`],
					[`Опять шуточки, да?`],
					[`Подожди.`],
					[`Не спеши.`],
					[`У тебя развязался шнурок.`],
					[`Ты пьяный?`],
					[`Как хочешь.`],
					[`Сделав круг почета, ты вернулся туда, откуда пришел.`],
					[`Трезво поразмыслив, ты решил этого не делать.`],
					[`Есть моменты, когда я начинаю сомневаться в твоих умственных способностях.`],
					[`Дважды два - четыре, дважды два - четыре...`],
					[`Монетку подбросить, что ли.`],
				];
				out = this.selectSentence(sentences);
				break;
			}
			case "p_go":
				{
					let { locCodeFrom, locCodesTo, map } = params;
					out = locCodesTo.map((code) => {
						let loc = map.findLocation(code);
						// sentence
						return `${loc.getCode()} - ${loc.getName()}`;
					});
					let sentences = [
						[`Отсюда можно пойти: `],
						[`Отсюда ты можешь податься: `],
						[`Тебе говорили, что отсюда можно пойти: `],
						[`Как ты помнишь, отсюда можно податься: `],
						[`Ты всегда знал, что отсюда можно пойти: `],
						[`Как опытный прогульщик, ты знаешь все тропинки: `],
						[`Как знатный ботан, ты помнишь все пути: `],
						[`Надеюсь, ты не забыл, что отсюда можно пойти: `],
						[`Избери свой путь: `],
						[`Выбери направление: `],
						[`Дорога рождается под ногами идущего: `],
						[`Чтобы прийти, нужно идти: `],
						[`Че стоишь? `],
						[`Че залип? `],
						[`Куда хочешь? `],
						[`М-да, вот если бы ты ходил на пары... `],
						[`Че, прогульщик? `],
						// [`М-да, вот если бы ты учился... `],


					];
					out = this.selectSentence(sentences).concat(out);
					let loc = map.findLocation(locCodeFrom);
					out.unshift(`Сейчас ты находишся в ${loc.getName()}.`);

					break;
				}
			default: {
				throw new Error(`Действие '${action}' не описано в GStoryteller.${name}`);
			}
		}
		return out;
	}


	function GMudak(obj) {
		if (!(this instanceof GMudak)) { return new GMudak(); }
		this.getId = () => obj.id;
		this.getType = () => obj.type;
		this.name = obj.name;
		this.locCode = obj.locCode;
	}
	const GMudakType = Object.freeze({
		Pacan: "GMudakType.Pacan",
		Otmorozok: "GMudakType.Otmorozok",
		Gopnik: "GMudakType.Gopnik",
		Vor: "GMudakType.Vor",
	});

	let _engine;
	function GEngine(devPlayerId, debugParams) {
		if (!(this instanceof GEngine)) { return new GEngine(devPlayerId, debugParams); }
		if (typeof _engine === "object") { return _engine };

		this.debugParams = debugParams;						// debug options
		this.devPlayerId = devPlayerId;						// todo - refactor
		let _defPlayerName = 'Раздолбай';
		let _defLocationCode = "kz";						// todo - refactor
		let _map = new GMap();
		let _storyteller = new GStoryteller();
		let _players = [];
		this.getDefPlayerName = () => _defPlayerName;
		this.getDefLocationCode = () => _defLocationCode;
		this.getMap = () => _map;							// не захищає від внесення змін всередину
		this.getStoryteller = () => _storyteller;			// не захищає від внесення змін всередину
		this.getPlayers = () => _players;					// не захищає від внесення змін всередину
		_engine = this;
	}
	GEngine.prototype.newPlayer = function (inp) {
		let m = new GMudak({
			type: inp.type,
			name: inp.name || this.getDefPlayerName(),
			locCode: this.getDefLocationCode(),
			id: this.devPlayerId,
		});
		this.loadPlayer(m);
	}
	GEngine.prototype.loadPlayer = function (mudak) {
		if (this.getPlayer(mudak.getId())) { return };
		this.getPlayers().push(mudak);
	}
	GEngine.prototype.getPlayer = function (id) {
		return this.getPlayers().find(p => p.getId() === id);
	}
	GEngine.prototype.showPlayerPathes = function (player) {
		let out = [],
			action = "";

		let ps = this.getMap().getNearbyLocPathes(player.locCode);
		let locCodesTo = ps.map((p) => {
			return player.locCode !== p.getLoc1Code() ?
				p.getLoc1Code() : p.getLoc2Code();
		});

		action = "p_go";
		actParams = {
			locCodeFrom: player.locCode,
			locCodesTo: locCodesTo,
			map: this.getMap(),		// todo - refactor - dictionary in Storyteller
		}
		out = this.getStoryteller().describe(action, actParams);
		return out;
	}
	GEngine.prototype.movePlayer = function (player, loc) {
		let out = [],
			action = "";

		if (player.locCode === loc.getCode()) {
			action = "p_go_same";
			out = this.getStoryteller().describe(action);
		}
		else {
			action = "p_go_loc";

			let path = this.getMap().findLocationPath(player.locCode, loc.getCode());
			let sucess = !!path;
			if (sucess) {
				player.locCode = loc.getCode();
			}

			let actParams = {
				locFrom: this.getMap().findLocation(player.locCode),
				locTo: loc,
				sucess: sucess,
			};
			out = this.getStoryteller().describe(action, actParams);
		}
		return out;
	}
	GEngine.prototype.receiveSignal = function (inp, playerId) {
		return new Promise((resolve, reject) => {
			let out = [],
				player = this.getPlayer(playerId),
				params = inp.toLowerCase().split(" "),
				signal = params.shift();
			if (this.debugParams.logTime) { console.time("*GEngine.prototype.receiveSignal(): "); }
			setTimeout(() => {
				try {
					switch (signal) {
						case "start":													// todo - refactor
							{
								out = [
									"Hello!",
									"What is your name?"];
								let inp = {
									type: GMudakType.Pacan,
									name: "",
								};
								this.newPlayer(inp);
							}
							break;
						case "i":														// todo - refactor
							if (!(player instanceof GMudak)) { break; }					// guard - для обробки сигналу потрібен гравець
							out = [
								// player.getId(), 
								player.name,
								// player.getType(),
								this.getMap().findLocation(player.locCode).getName(),
							];
							break;
						case "go":
							{
								if (!(player instanceof GMudak)) { break; }				// guard - для обробки сигналу потрібен гравець

								if (params.length == 0) {								// go
									out = this.showPlayerPathes(player);
								}
								else {
									let locCode = params[0];							// go <loc>

									let locTo = this.getMap().findLocation(locCode);	// guard - для обробки сигналу потрібна локація
									if (!(locTo instanceof Location)) { break; }
									out = this.movePlayer(player, locTo) || out;
								}
							}
							break;
						default:
							break;
					}
					resolve(out);
					// reject(new Error('Test error :)'));
				}
				finally {
					if (this.debugParams.logTime) { console.timeEnd("*GEngine.prototype.receiveSignal(): "); }
				}
			}, Math.ceil(Math.random() * 2000));
		});
	}
	GEngine.prototype.verifySignal = function () { }		// todo
	GEngine.prototype.getAllowedSignals = function () { }	// todo
	return GEngine;
})();

App.define("GApp.GConsole");
App.GApp.GConsole = (function (global) {
	function GConsole(engine, debugParams) {
		if (!(this instanceof GConsole)) { return new GConsole(engine, debugParams); }
		this.debugParams = debugParams;						// debug options
		this.getEngine = () => engine;						// не захищає від внесення змін всередину
		this.getPlayerId = () => this.getEngine().devPlayerId;
		this._enableInput = this._setEnableInput(true);
	};
	GConsole.prototype._log = function (str) {
		global.console.log(str);
	}
	GConsole.prototype._display = function (str) {
		global.console.log(str);
	}
	GConsole.prototype._setEnableInput = function (bool) {
		this._enableInput = bool;
		if (this.debugParams.logEnableInput) { this._log("*GConsole._enableInput == " + this._enableInput); }
		if (this._enableInput) { this._log(''); }
	}
	GConsole.prototype._sendSignal = function (signal) {
		try {
			if (this.debugParams.logSignal) { this._log('*signal: ' + signal); }
			this._setEnableInput(false);
			return this.getEngine().receiveSignal(signal, this.getPlayerId());
		}
		catch (error) {
			console.error("Catched in 'GConsole.prototype._sendSignal()': " + error);
			this._setEnableInput(true);
		}
		finally {
		}
	};
	GConsole.prototype._displaySignalAnswer = function (arr) {
		try {
			for (let v of arr) {
				this._display(v);
			}
			// throw new Error('Test error :)');
		}
		finally {
			this._setEnableInput(true);
		}
	};
	GConsole.prototype.initTest = function () {
		// приклад використання промісів, а не async function
		return new Promise(resolve => {
			try {
				let p = this._sendSignal("start");
				p.then(out => {
					this._displaySignalAnswer(out);
					return this._sendSignal("i");
				}).then((out) => {
					this._displaySignalAnswer(out);
					resolve();
				});
			}
			catch (e) { }
			finally { }
		});

	}
	GConsole.prototype.runAutoTest = async function () {
		try {
			if (this.debugParams.logTime) { console.time("*GConsole.prototype.runAutoTest(): "); }
			await this.initTest();
			let signals = [
				() => this._sendSignal("go"),
				() => this._sendSignal("go pk"),
				() => this._sendSignal("go"),
				() => this._sendSignal("go ka"),
				() => this._sendSignal("go"),
				() => this._sendSignal("go ml"),
			];
			for (let p of signals) {
				let out = await p();
				this._displaySignalAnswer(out);
			}
		}
		catch (error) {
			console.error("Catched in 'Console.prototype.runAutoTest()': " + error);
		}
		finally {
			if (this.debugParams.logTime) { console.timeEnd("*GConsole.prototype.runAutoTest(): "); }
		}
	}
	GConsole.prototype.runDevInput = async function () {
		let s = "",
			out = [],
			cont = true;

		await this.initTest();
		while (cont) {
			s = global.prompt("\\");
			switch (s) {
				case "":
					continue;
				case null:
				case "e":
					if (this.debugParams.logSignal) { this._log(`signal: ${s}`); }
					cont = global.confirm(`Continue?`);
					this._log(`Continue?: ${cont}`);
					if (!cont) {
						this._log('Exit');
						break;
					} else {
						continue;
					}
					break;
				default:
					{
						out = await this._sendSignal(s);
						this._displaySignalAnswer(out);
						continue;
					}
			}
		}
	}
	return GConsole;
})(this);

// Крок 3 - використання бібліотеки
(function (global) {
	// logs
	const debugParams = {
		logTime: false,
		logEnableInput: false,
		logSignal: false,
	}

	// dev
	const devPlayerId = 0;

	// run
	let gEngine = new App.GApp.GEngine(devPlayerId, debugParams);
	let gConsole = new App.GApp.GConsole(gEngine, debugParams);
	// gConsole.runAutoTest();		// запуск автотеста
	setTimeout(() => {				// запуск так, щоб працював real-time вивід в консоль
		gConsole.runDevInput();		// запуск з ручним вводом сигналів
	}, 500);

})(this);

