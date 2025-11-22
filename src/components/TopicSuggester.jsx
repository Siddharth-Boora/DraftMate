import React, { useState, useEffect, useRef } from "react";
import "./TopicSuggester.css";

const TopicSuggester = () => {
    const [topic, setTopic] = useState("");
    const [suggestedTitle, setSuggestedTitle] = useState("");
    const [suggestedTopics, setSuggestedTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [aiReady, setAiReady] = useState(false);
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

                {suggestedTitle && (
                    <div className="suggested-title-container">
                        <p className="suggested-label">Suggested Topic:</p>
                        <h3 className="suggested-title">{suggestedTitle}</h3>
                    </div>
                )}

                <div className="suggested-topics-container">
                    <p className="suggested-topics-label">Suggested Topics:</p>
                    <div className="suggested-topics-list">
                        {displayTopics.map((topicText, index) => (
                            <div key={index} className="suggested-topic-item">
                                <span className="topic-bullet">•</span>
                                <span className="topic-text">{topicText}</span>
                            </div>
                        ))}
                    </div>
                </div>

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
