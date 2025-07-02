 // BRAC University Knowledge Base
        const universityKnowledge = {
            general: {
                name: "BRAC University",
                location: "66 Mohakhali, Dhaka 1212, Bangladesh",
                founded: "2001",
                type: "Private Research University",
                chancellor: "Sir Fazle Hasan Abed",
                website: "www.bracu.ac.bd",
                phone: "+880-2-9844051-4",
                email: "info@bracu.ac.bd"
      
            },
            programs: {
                engineering: ["Computer Science", "Electrical Engineering", "Architecture"],
                business: ["BBA", "MBA", "Economics", "Finance"],
                law: ["LLB", "LLM"],
                health: ["Public Health", "Nutrition", "Environmental Health"]
            },
            admissions: {
                undergraduate: "HSC/A-Level with minimum GPA + BRAC University Admission Test",
                graduate: "Bachelor's degree with minimum CGPA + Graduate admission test",
                deadlines: "Usually June-July for Fall semester"
            },
            fees: {
                undergraduate: "8,000-12,000 BDT per credit hour",
                graduate: "10,000-15,000 BDT per credit hour",
                scholarships: "Merit-based and need-based scholarships available"
            },
            facilities: ["Central Library", "Computer Labs", "Science Labs", "Sports Complex", "Cafeteria", "Medical Center", "Dormitories"]
        };

        // Voice Recognition Setup
        let recognition;
        let isListening = false;

        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        }

        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                isListening = true;
                updateStatus('🎤 Listening... Speak now!', 'I\'m listening to your question about BRAC University.');
                document.getElementById('startBtn').disabled = true;
                document.getElementById('stopBtn').disabled = false;
                document.querySelector('.container').classList.add('recording');
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                addMessage(transcript, 'user');
                processQuery(transcript);
            };

            recognition.onerror = function(event) {
                showError('Speech recognition error: ' + event.error);
                resetButtons();
            };

            recognition.onend = function() {
                isListening = false;
                resetButtons();
            };
        } else {
            showError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
        }

        // Event Listeners
        document.getElementById('startBtn').addEventListener('click', startListening);
        document.getElementById('stopBtn').addEventListener('click', stopListening);

        function startListening() {
            if (recognition && !isListening) {
                recognition.start();
                hideError();
            }
        }

        function stopListening() {
            if (recognition && isListening) {
                recognition.stop();
            }
        }

        function resetButtons() {
            document.getElementById('startBtn').disabled = false;
            document.getElementById('stopBtn').disabled = true;
            document.querySelector('.container').classList.remove('recording');
            updateStatus('🎙️ Voice Assistant Ready', 'Click "Start Listening" to ask another question!');
        }

        function updateStatus(title, message) {
            const status = document.getElementById('status');
            status.innerHTML = `<h3>${title}</h3><p>${message}</p>`;
        }

        function addMessage(text, sender) {
            const conversation = document.getElementById('conversation');
            conversation.style.display = 'block';
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = text;
            
            conversation.appendChild(messageDiv);
            conversation.scrollTop = conversation.scrollHeight;
        }

        function processQuery(query) {
            updateStatus('🤔 Processing...', 'Let me find the information for you.');
            
            // Show loading
            addMessage('Thinking... ⏳', 'assistant');
            
            // Process the query
            setTimeout(() => {
                const response = generateResponse(query.toLowerCase());
                
                // Remove loading message
                const messages = document.querySelectorAll('.assistant-message');
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.textContent.includes('Thinking...')) {
                    lastMessage.remove();
                }
                
                addMessage(response, 'assistant');
                speak(response);
            }, 1000);
        }

        function generateResponse(query) {
            const knowledge = universityKnowledge;
            
            // Greeting responses
            if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
                return "Hello! I'm your BRAC University voice assistant. I can help you with information about admissions, programs, facilities, fees, and more. What would you like to know?";
            }
            
            // About university
            if (query.includes('what is brac') || query.includes('about brac') || query.includes('tell me about brac')) {
                return `BRAC University is a ${knowledge.general.type} established in ${knowledge.general.founded}. It's located at ${knowledge.general.location} and has become one of the leading private universities in Bangladesh, known for quality education and research.`;
            }
            
            // Location
            if (query.includes('location') || query.includes('where') || query.includes('address')) {
                return `BRAC University is located at ${knowledge.general.location}. The main campus is in Mohakhali, which is easily accessible from different parts of Dhaka city.`;
            }
            
            // Programs
            if (query.includes('program') || query.includes('course') || query.includes('department') || query.includes('study')) {
                return `BRAC University offers various programs including: Engineering programs like ${knowledge.programs.engineering.join(', ')}, Business programs like ${knowledge.programs.business.join(', ')}, Law programs including ${knowledge.programs.law.join(', ')}, and Health programs like ${knowledge.programs.health.join(', ')}.`;
            }
            
            // Computer Science
            if (query.includes('computer science') || query.includes('cse') || query.includes('cs program')) {
                return "The Computer Science program at BRAC University covers programming, algorithms, software engineering, artificial intelligence, and database systems. It's designed to prepare students for careers in technology and research.";
            }
            
            // Business programs
            if (query.includes('business') || query.includes('bba') || query.includes('mba')) {
                return "BRAC Business School offers BBA and MBA programs covering management, finance, marketing, and entrepreneurship. The school has strong industry connections and provides practical learning opportunities.";
            }
            
            // Admissions
            if (query.includes('admission') || query.includes('apply') || query.includes('application') || query.includes('requirement')) {
                return `For undergraduate admission, you need ${knowledge.admissions.undergraduate}. For graduate programs, you need ${knowledge.admissions.graduate}. Applications typically open ${knowledge.admissions.deadlines}.`;
            }
            
            // Fees
            if (query.includes('fee') || query.includes('cost') || query.includes('tuition') || query.includes('price')) {
                return `Undergraduate tuition is ${knowledge.fees.undergraduate}. Graduate tuition is ${knowledge.fees.graduate}. The university also offers ${knowledge.fees.scholarships}.`;
            }
            
            // Scholarships
            if (query.includes('scholarship') || query.includes('financial aid')) {
                return "BRAC University offers merit-based scholarships for high-achieving students and need-based financial aid for students from economically disadvantaged backgrounds. You can apply during the admission process.";
            }
            
            // Facilities
            if (query.includes('facilities') || query.includes('campus') || query.includes('library')) {
                return `BRAC University provides excellent facilities including ${knowledge.facilities.join(', ')}. These facilities support both academic and extracurricular activities.`;
            }
            
            // Contact
            if (query.includes('contact') || query.includes('phone') || query.includes('email')) {
                return `You can contact BRAC University at phone ${knowledge.general.phone} or email ${knowledge.general.email}. You can also visit their website at ${knowledge.general.website}.`;
            }


            // if (query.includes('obaida') || query.includes('obyda') || query.includes('obyda tasnim')) {
            //     return "Obyda tasnim is a talented student from Brac University";
            // }

            //  if (query.includes('mamun') || query.includes('mamun abdullah') || query.includes('shakil')) {
            //     return "Mamun Abdullah is a talented student from Brac University";
            // }

            //  if (query.includes('farzia') || query.includes('akhter') || query.includes('')) {
            //     return "Farzia Akhter is one of the talented student from Brac University with the CGPA of 4 out of 4. She is the upcoming faculty of Computer Science Department";
            // }
            

            // if (query.includes('hamim') || query.includes('hamim nasim') || query.includes('hameem')) {
            //     return "Hamim Nasim is a talented student from Brac University with a CGPA of 3.93 out of 4 and currently apponted as adjunct lecturer at Brac University";
            // }


//             if (query.includes('tasib') || query.includes('ahsan') || query.includes('nirob') || query.includes('nirav'))  {

//                 return 'Tasib Ahsan Nirob is a talented student from BRAC University with CGPA of 3.5 out of 4. And he is the greatest fartman of all time. People also knows him as a PEW';
//             }
            
//    if (query.includes('mohammad') || query.includes('hussain') || query.includes('shihab'))  {

//                return 'Mohammad Hossain shihab is a talented student from BRAC University with CGPA of 2.65 out of 4. And he is the greatest batsman of all time with the highest record of ducks in every format';
//              }
            

            
            
            // Default response
            return "I did'nt get it. Can you be more specific?";
        }

        function speak(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 0.8;
                speechSynthesis.speak(utterance);
            }
        }

        function showError(message) {
            const errorDiv = document.getElementById('error');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        function hideError() {
            document.getElementById('error').style.display = 'none';
        }

        // Initialize
        window.addEventListener('load', function() {
            if (!recognition) {
                showError('Speech recognition not supported. Please use Chrome, Edge, or Safari.');
            }
        });