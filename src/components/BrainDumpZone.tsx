import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Mic, MicOff } from "lucide-react";


interface BrainDumpZoneProps {
    onSubmitIdea: (rawInput: string) => Promise<void>;
    isLoading: boolean;
    loadingProgressBar: string;
}

export const BrainDumpZone: React.FC<BrainDumpZoneProps> = ({
    onSubmitIdea,
    isLoading,
    loadingProgressBar
}) => {
    const [rawInput, setRawInput] = useState('');
    const [isListening, setIsListening] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (textareaRef.current){
            textareaRef.current.focus();
        }
    }, [])

    /*Speech Recognition set up */
    useEffect(() => {
        const windowWithSpeech = window as any;
        const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

        if (SpeechRecognition){
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.lang = navigator.language;

            recognition.onresult = (event: any) => {
                let final = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    }
                }

                if (final) {
                    setRawInput((prev) =>{
                        const needsSpace = prev && !prev.endsWith(' ') && !prev.endsWith('\n');
                        return prev + (needsSpace ? ' ' : '') + final;
                    });
                }
            }

            recognition.onerror = () => {
                console.warn("Speech Recognition Error");
                setIsListening(false);
            }

            recognition.onend = () => {
                setIsListening(false);
            }
            recognitionRef.current = recognition;
        }

        return () => {
            if(recognitionRef.current){
                try{
                    recognitionRef.current.stop();
                } catch (e) {

                }
            }
        }
    }, []);

    const toggleListening = () => {

        if(isListening){
            if(recognitionRef.current){
                recognitionRef.current.stop();
            }
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                setIsListening(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if((e.metaKey || e.ctrlKey) && e.key === 'Enter'){
            e.preventDefault;
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if(!rawInput.trim() || isLoading) return;
        if(isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        onSubmitIdea(rawInput);
    }

    return (
        <div className="flex-1 flex flex-col p-4 items-center justify-center md:p-8 max-w-5xl mx-auto w-full min-h-[calc(100vh-4rem)]">

            {/*Header*/}
            <div className="flex flex-col items-center mb-8 space-y-2 animate-fade-in">
                <h2 className="font-semibold text-3xl md:text-4xl tracking-tight text-neutral-900 font-sans">Unload your thoughts</h2>
                <p className="text-neutral-500 text-sm max-w-md mx-auto font-normal">Write or speak your raw idea to structure it instantly.</p>
            </div>

            {/*Main Container*/}
            <div className={`paper-card rounded-3xl p-5 md:p-7 transition-all duration-200 
            ${isListening ? 'ring-2 ring-neutral-900 border-neutral-400 bg-white' : 'focus-within:border-neutral-400'
            }`}>
                {/*Top Bar*/}
                <div className="flex flex-rox justify-between items-center pb-3 mb-3 border-b border-neutral-100 text-xs text-neutral-400">
                    <span></span>

                    {isListening ? (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-pulse">
                            <div className="flex items-end gap-0.5 h-3">
                                <span className="w-0.5 bg-rose-600 rounded-full animate-voice-1"></span>
                                <span className="w-0.5 bg-rose-600 rounded-full animate-voice-2"></span>
                                <span className="w-0.5 bg-rose-600 rounded-full animate-voice-3"></span>
                            </div>
                            <span>Listening...</span>
                        </div>) : (
                            <span className="font-mono text-[11px] text-neutral-400">
                                {rawInput.length > 0 ? `${rawInput.length} chars.` : ''}
                            </span>
                        )}
                </div>

                {/* Text Area */}
                <textarea 
                    ref={textareaRef}
                    value={rawInput}
                    onChange={(e) => {
                        setRawInput(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder="Write or dictate your idea here without worrying about formatting..."
                    className="w-full h-48 md:h-56 bg-transparent text-neutral-900 placeholder:text-neutral-300 text-base md:text-lg font-sans leading-relaxed resize-none focus:outline-none border-none p-1"
                />

                {/*Bottom Bar*/}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                    <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors focus-ring cursor-pointer ${isListening
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80'
                        }`}
                    >
                        {isListening ? (
                            <>
                                <MicOff className="w-3.5 h-3.5" />
                                <span>Stop</span>
                            </>
                        ) : (
                            <>
                                <Mic className="w-3.5 h-3.5 text-neutral-600" />
                                <span>Voice Dictation</span>
                            </>
                        )}
                    </motion.button>

                    <div className="flex items-center justify-end gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                            Cmd/Ctrl + Enter
                        </span>

                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            onClick={handleSubmit}
                            disabled={!rawInput.trim() || isLoading}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-xs hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors shadow-xs focus-ring cursor-pointer"
                        >
                            <span>Structure Idea</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/*Loader*/}
            {isLoading && (
                <div className="fixed inset-0 bg-neutral-900/30 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-neutral-200 text-center space-y-4 animate-slide-up">
                        <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-neutral-100"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin"></div>
                            <BrainCircuit className="w-5 h-5 text-neutral-900" />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-neutral-900">
                                Incubation in progress...
                            </h3>
                            <p className="text-xs text-neutral-400">
                                {loadingProgressBar || "Structuring information..."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};