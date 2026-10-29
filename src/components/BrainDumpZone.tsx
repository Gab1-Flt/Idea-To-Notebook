import { useEffect, useRef, useState } from "react";


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
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
                let currentTypescript = '';
                for (let i = event.resultIndex; i < event.results.length; i++){
                    currentTypescript += event.results[i][0].transcript;
                }

                setRawInput((prev) =>{
                    if(prev && !prev.includes(' ') && !prev.includes('\n')){
                        return prev + ' ' + currentTypescript;
                    }
                    return prev + currentTypescript;
                })
            }

            recognition.onerror = () => {
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
        <div>
            
        </div>
    )
}