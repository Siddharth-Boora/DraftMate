import React, { useState, useEffect, useRef } from "react";
import "./TopicSuggester.css";

const TopicSuggester = () => {
    const [topic, setTopic] = useState("");
    const [suggestedTitle, setSuggestedTitle] = useState("");
    const [suggestedTopics, setSuggestedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiReady, setAiReady] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedType, setSelectedType] = useState(null); // 'user', 'ai', or 'example'
    const [selectedTextType, setSelectedTextType] = useState(null); // 'essay', 'article', 'email', 'product', 'story'
    const debounceRef = useRef(null);

    // Check if AI is ready
    useEffect(() => {
        const checkReady = setInterval(() => {
            if (window.puter && window.puter.ai && typeof window.puter.ai.chat === "function") {
                setAiReady(true);
                clearInterval(checkReady);
            }
        }, 300);
        return () => clearInterval(checkReady);
    }, []);

    // Generate suggestions when topic or text type changes
    useEffect(() => {
        if (!topic.trim()) {
            setSuggestedTitle("");
            setSuggestedTopics([]);
            setSelectedTopic(null);
            setSelectedType(null);
            return;
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);

                // Build text type-specific title instructions
                let titleInstruction = "";
                let contextDescription = "";

                if (selectedTextType) {
                    const typeInstructions = {
                        'essay': {
                            title: 'Create a short, modern title (1–2 words) for an essay. The title should sound academic, structured, and intelligent.',
                            context: 'an academic essay'
                        },
                        'article': {
                            title: 'Create a short, professional title (1–2 words) for an article. The title should feel journalistic and clear.',
                            context: 'an article or blog post'
                        },
                        'email': {
                            title: 'Create a neutral, straightforward title (1–2 words) for an email. Use ONLY the information provided in the user prompt. Do not add any external context or embellishment. Simply state what the user wrote.',
                            context: 'an email'
                        },
                        'product': {
                            title: 'Create a short, marketing-style title (1–2 words) for a product description. The title should feel commercial and persuasive.',
                            context: 'a product description'
                        },
                        'story': {
                            title: 'Create a short, creative title (1–2 words) for a story. The title should feel imaginative but minimal.',
                            context: 'a narrative or short story'
                        }
                    };

                    titleInstruction = typeInstructions[selectedTextType].title;
                    contextDescription = `The user wants to write ${typeInstructions[selectedTextType].context}. `;
                }

                const response = await window.puter.ai.chat(`
You are DraftMate, an AI writing assistant.
The user entered the topic: "${topic}"
${contextDescription}

${titleInstruction ? `TITLE INSTRUCTION FOR MAIN SUGGESTION: ${titleInstruction}

Your main suggested topic should be the BEST, most refined, and most compelling version. This is the top recommendation.

Then generate 3 alternative example topics that are good but not as polished or refined as the main suggestion.` : `1. Generate ONE catchy, specific suggested topic title (1-2 words preferred) based on their input - this should be your BEST suggestion.
2. Generate 3 alternative example topic suggestions that are good but not as refined as the main suggestion.`}

Format your response EXACTLY like this:
SUGGESTED TOPIC: [Your BEST suggested topic title here - most refined and compelling]
EXAMPLE 1: [Alternative topic - good but not as polished]
EXAMPLE 2: [Alternative topic - good but not as polished]
EXAMPLE 3: [Alternative topic - good but not as polished]
        `);

                const content = response?.message?.content || response?.content || "";
                const lines = content.split("\n").map(l => l.trim()).filter(l => l);

                // Parse suggested topic
                const titleLine = lines.find(line => line.startsWith("SUGGESTED TOPIC:"));
                if (titleLine) {
                    setSuggestedTitle(titleLine.replace("SUGGESTED TOPIC:", "").trim());
                }

                // Parse example topics
                const examples = lines
                    .filter(line => line.match(/^EXAMPLE \d+:/))
                    .map(line => line.replace(/^EXAMPLE \d+:/, "").trim())
                    .filter(text => text);

                setSuggestedTopics(examples);

            } catch (err) {
                console.error("Error generating suggestions:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [topic, selectedTextType]);

    // Default example topics when no input
    const defaultTopics = [
        "The Impact of Social Media on Modern Communication",
        "How Technology is Transforming Education",
        "The Role of Renewable Energy in Fighting Climate Change"
    ];

    const displayTopics = topic.trim() && suggestedTopics.length > 0 ? suggestedTopics : defaultTopics;

    const handleSelectTopic = (topicText, type) => {
        // Toggle selection - if clicking the same topic, deselect it
        if (selectedTopic === topicText && selectedType === type) {
            setSelectedTopic(null);
            setSelectedType(null);
        } else {
            setSelectedTopic(topicText);
            setSelectedType(type);
        }
    };

    const handleNext = () => {
        if (selectedTopic) {
            // TODO: Navigate to the next page with the selected topic
            console.log("Selected topic:", selectedTopic, "Type:", selectedType, "Text Type:", selectedTextType);
        }
    };

    const isNextEnabled = selectedTopic && !loading;

    return (
        <div className="topic-suggester">
            <div className="topic-suggester-content">
                <h2 className="topic-suggester-title">What would you like to write about?</h2>
                <p className="topic-suggester-subtitle">Enter your topic and let DraftMate craft an outline</p>

                <div className="topic-input-container">
                    <input
                        type="text"
                        className="topic-input"
                        placeholder="Type your prompt here..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={!aiReady}
                    />
                    {loading && (
                        <div className="topic-loading">
                            <div className="loading-spinner"></div>
                        </div>
                    )}
                </div>

                {/* Text Type Selector - Radio style */}
                <div className="text-type-selector">
                    <label
                        className={`text-type-option ${selectedTextType === 'essay' ? 'selected' : ''}`}
                        onClick={() => setSelectedTextType('essay')}
                    >
                        <input type="checkbox" checked={selectedTextType === 'essay'} readOnly />
                        <span>Essay</span>
                    </label>
                    <label
                        className={`text-type-option ${selectedTextType === 'article' ? 'selected' : ''}`}
                        onClick={() => setSelectedTextType('article')}
                    >
                        <input type="checkbox" checked={selectedTextType === 'article'} readOnly />
                        <span>Article</span>
                    </label>
                    <label
                        className={`text-type-option ${selectedTextType === 'email' ? 'selected' : ''}`}
                        onClick={() => setSelectedTextType('email')}
                    >
                        <input type="checkbox" checked={selectedTextType === 'email'} readOnly />
                        <span>Email</span>
                    </label>
                    <label
                        className={`text-type-option ${selectedTextType === 'product' ? 'selected' : ''}`}
                        onClick={() => setSelectedTextType('product')}
                    >
                        <input type="checkbox" checked={selectedTextType === 'product'} readOnly />
                        <span>Product Description</span>
                    </label>
                    <label
                        className={`text-type-option ${selectedTextType === 'story' ? 'selected' : ''}`}
                        onClick={() => setSelectedTextType('story')}
                    >
                        <input type="checkbox" checked={selectedTextType === 'story'} readOnly />
                        <span>Story</span>
                    </label>
                </div>

                {/* User's Custom Topic Option */}
                {topic.trim() && (
                    <div
                        className={`suggested-topic-item user-topic ${selectedType === 'user' ? 'selected' : ''}`}
                        onClick={() => handleSelectTopic(topic, 'user')}
                    >
                        <div className="topic-content">
                            <span className="topic-label">Your Topic:</span>
                            <span className="topic-text">{topic}</span>
                        </div>
                    </div>
                )}

                {/* AI Suggested Topic - Shows loading animation or result */}
                {(loading || suggestedTitle) && topic.trim() && (
                    <div
                        className={`suggested-title-container ${loading ? 'loading' : ''} ${selectedType === 'ai' ? 'selected' : ''}`}
                        onClick={() => !loading && handleSelectTopic(suggestedTitle, 'ai')}
                        style={{ cursor: loading ? 'default' : 'pointer' }}
                    >
                        {loading ? (
                            <>
                                <p className="suggested-label">AI Suggested Topic:</p>
                                <div className="loading-gradient-box">
                                    <div className="gradient-shimmer"></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="suggested-label">AI Suggested Topic:</p>
                                <h3 className="suggested-title">{suggestedTitle}</h3>
                            </>
                        )}
                    </div>
                )}

                {/* Example Topics */}
                <div className="suggested-topics-container">
                    <p className="suggested-topics-label">Suggested Topics:</p>
                    <div className="suggested-topics-grid">
                        {displayTopics.map((topicText, index) => (
                            <div
                                key={index}
                                className={`suggested-topic-box ${selectedType === 'example' && selectedTopic === topicText ? 'selected' : ''}`}
                                onClick={() => handleSelectTopic(topicText, 'example')}
                            >
                                <span className="topic-text">{topicText}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    className={`next-button ${isNextEnabled ? 'enabled' : 'disabled'}`}
                    onClick={handleNext}
                    disabled={!isNextEnabled}
                >
                    Next
                    <span className="arrow-icon">→</span>
                </button>

                {!aiReady && (
                    <div className="ai-status waiting">
                        <span className="status-icon">🟡</span>
                        Waiting for AI...
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicSuggester;
