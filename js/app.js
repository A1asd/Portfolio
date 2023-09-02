const { createApp } = Vue;

const app = createApp({
	methods: {
		changeLanguage: function(code) {
			this.locale = code;
		},
		changeTab: function(tab) {
			this.activeTab = tab;
			localStorage.setItem('tab', tab);
		},
		changeBallHeight: function(target) {
			let t = target.firstChild.firstChild;
			let padding = window.getComputedStyle(t, null).getPropertyValue('padding-top');
			this.$refs.referenceball.style.top = t.offsetTop + parseFloat(padding) + 2 + 'px';
			target.classList.add('active');
		},
		toggleDarkTheme() {
			if (document.documentElement.classList.contains('dark')) {
				document.documentElement.classList.remove('dark');
				localStorage.setItem("theme", 'light');
			}
			else {
				document.documentElement.classList.add('dark');
				localStorage.setItem("theme", 'dark');
			}
		},
		toggleContrastTheme() {
			if (document.documentElement.classList.contains('contrast')) {
				document.documentElement.classList.remove('contrast');
				localStorage.removeItem("contrast");
			}
			else {
				document.documentElement.classList.add('contrast');
				localStorage.setItem("contrast", true);
			}
		},
		translate: function(code){
			let splitCode = code.split('.');
			let translation = this.i18n[this.locale];
			for (let i = 0; i < splitCode.length; i++) {
				translation = translation[splitCode[i]];
				if (translation === undefined) return "(T)" + code
			}
			return translation;
		},
		getTranslationData: function(locale) {
			axios.get('./translations/' + locale + '.json').then(response => {this.i18n[locale] = response.data});
		},
		getLeftBarWidth: function() {
			return this.$refs.leftBar.offsetWidth ?? '0px'
		}
	},
	beforeMount() {
		this.changeLanguage(this.locale);
		this.changeTab(localStorage.getItem("tab") ?? 'competence');
		if (localStorage.getItem("theme") === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.classList.add('dark');
		}
		if (localStorage.getItem("contrast")) {
			document.documentElement.classList.add('contrast');
		}
	},
	afterMount() {
		this.$refs.referenceball.style.top = '0';
	},
	data() {
		['de', 'en', 'ja'].forEach(lc => this.getTranslationData(lc));
		return {
			enlarge: false,
			activeTab: '',
			locale: navigator.languages[0].split('-')[0],
			i18n: {'de':{}, 'en':{}, 'ja':{}},
			config: axios.get('./config.json').then(response => this.config = response.data),
			leftBarWidth: this.getLeftBarWidth,
			betterTranslations: [],
		}
	}
});

app.mount('#app');
