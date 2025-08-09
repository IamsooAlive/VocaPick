class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private currentLanguage: 'en' | 'ja' = 'en';
  private isListening = false;
  private onCommandCallback: ((command: string, confidence: number) => void) | null = null;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }

    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        const command = result[0].transcript.toLowerCase().trim();
        const confidence = result[0].confidence;
        this.processCommand(command, confidence);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  }

  setLanguage(language: 'en' | 'ja') {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language === 'en' ? 'en-US' : 'ja-JP';
    }
  }

  startListening(onCommand: (command: string, confidence: number) => void) {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    this.onCommandCallback = onCommand;
    this.isListening = true;
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onCommandCallback = null;
    }
  }

  private processCommand(command: string, confidence: number) {
    if (this.onCommandCallback) {
      this.onCommandCallback(command, confidence);
    }
  }

  speak(text: string, language?: 'en' | 'ja') {
    if (!this.synthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = (language || this.currentLanguage) === 'en' ? 'en-US' : 'ja-JP';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    this.synthesis.speak(utterance);
  }

  parsePickingCommand(command: string, language: 'en' | 'ja' = 'en') {
    const commands = {
      en: {
        pick: ['pick', 'picked', 'take', 'took', 'get', 'got'],
        confirm: ['confirm', 'yes', 'correct', 'done', 'complete'],
        skip: ['skip', 'missing', 'not found', 'unavailable'],
        repeat: ['repeat', 'again', 'what', 'pardon'],
        help: ['help', 'assistance', 'support']
      },
      ja: {
        pick: ['ピック', 'とる', 'とった', '取る', '取った'],
        confirm: ['確認', 'はい', '正しい', '完了', 'かんりょう'],
        skip: ['スキップ', 'ない', '見つからない', '在庫切れ'],
        repeat: ['繰り返し', 'もう一度', '何', 'すみません'],
        help: ['ヘルプ', '助け', 'サポート']
      }
    };

    const langCommands = commands[language];
    
    for (const [action, phrases] of Object.entries(langCommands)) {
      if (phrases.some(phrase => command.includes(phrase))) {
        // Extract quantity if present
        const quantityMatch = command.match(/(\d+)/);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        
        return {
          action,
          quantity,
          originalCommand: command,
          language,
          confidence: 1.0
        };
      }
    }

    return {
      action: 'unknown',
      quantity: 1,
      originalCommand: command,
      language,
      confidence: 0.5
    };
  }

  getVoiceCommands(language: 'en' | 'ja' = 'en') {
    const commands = {
      en: {
        'Pick [quantity]': 'Confirm picking items',
        'Confirm': 'Confirm current action',
        'Skip': 'Skip item (not found/unavailable)',
        'Repeat': 'Repeat last instruction',
        'Help': 'Get assistance'
      },
      ja: {
        '[数量] ピック': 'アイテムのピックを確認',
        '確認': '現在のアクションを確認',
        'スキップ': 'アイテムをスキップ（見つからない/在庫切れ）',
        '繰り返し': '最後の指示を繰り返し',
        'ヘルプ': 'サポートを受ける'
      }
    };

    return commands[language];
  }

  isSupported() {
    return !!(this.recognition && this.synthesis);
  }
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default new VoiceService();