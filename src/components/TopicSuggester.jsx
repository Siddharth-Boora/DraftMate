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

    // Generate suggestions when topic changes
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
                const response = await window.puter.ai.chat(`
You are DraftMate, an AI writing assistant.
The user entered the topic: "${topic}"

1. Generate ONE catchy, specific suggested topic title based on their input.
2. Generate 3 related example topic suggestions that are different but related to their input.

Format your response EXACTLY like this:
SUGGESTED TOPIC: [Your suggested topic title here]
EXAMPLE 1: [First example topic]
EXAMPLE 2: [Second example topic]
EXAMPLE 3: [Third example topic]
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
        }, 800);

        return () => clearTimeout(debounceRef.current);
    }, [topic]);

    // Default example topics when no input
    const defaultTopics = [
        "The Impact of Social Media on Modern Communication",
        "How Technology is Transforming Education",
        "The Role of Renewable Energy in Fighting Climate Change"
    ];

    const displayTopics = topic.trim() && suggestedTopics.length > 0 ? suggestedTopics : defaultTopics;

    const handleSelectTopic = (topicText, type) => {
        setSelectedTopic(topicText);
        setSelectedType(type);
    };

    const handleNext = () => {
        if (selectedTopic) {
            // TODO: Navigate to the next page with the selected topic
            console.log("Selected topic:", selectedTopic, "Type:", selectedType);
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

                {/* User's Custom Title Option */}
                {topic.trim() && (
                    <div
                        className={`topic-option user-topic ${selectedType === 'user' ? 'selected' : ''}`}
                        onClick={() => handleSelectTopic(topic, 'user')}
                    >
                        <div className="option-header">
                            <span className="option-label">Your Title:</span>
                            <div className={`selection-indicator ${selectedType === 'user' ? 'active' : ''}`}>
                                {selectedType === 'user' && <span className="checkmark">✓</span>}
                            </div>
                        </div>
                        <p className="option-text">{topic}</p>
                    </div>
                )}

                {/* AI Suggested Title Option */}
                {suggestedTitle && (
                    <div
                        className={`topic-option ai-topic ${selectedType === 'ai' ? 'selected' : ''}`}
                        onClick={() => handleSelectTopic(suggestedTitle, 'ai')}
                    >
                        <div className="option-header">
                            <span className="option-label">AI Suggested Title:</span>
                            <div className={`selection-indicator ${selectedType === 'ai' ? 'active' : ''}`}>
                                {selectedType === 'ai' && <span className="checkmark">✓</span>}
                            </div>
                        </div>
                        <p className="option-text">{suggestedTitle}</p>
                    </div>
                )}

                {/* Example Topics */}
                <div className="suggested-topics-container">
                    <p className="suggested-topics-label">Or choose from these suggestions:</p>
                    <div className="suggested-topics-list">
                        {displayTopics.map((topicText, index) => (
                            <div
                                key={index}
                                className={`suggested-topic-item ${selectedType === 'example' && selectedTopic === topicText ? 'selected' : ''}`}
                                onClick={() => handleSelectTopic(topicText, 'example')}
                            >
                                <span className="topic-bullet">•</span>
                                <span className="topic-text">{topicText}</span>
                                {selectedType === 'example' && selectedTopic === topicText && (
                                    <span className="checkmark-inline">✓</span>
                                )}
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

