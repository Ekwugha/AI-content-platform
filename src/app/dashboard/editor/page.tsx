"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Save,
  Send,
  Copy,
  Download,
  RotateCcw,
  Settings2,
  ChevronRight,
  Hash,
  Target,
  Globe,
  Lightbulb,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIThinking } from "@/components/ai-thinking";
import { useEditorStore, useContentStore } from "@/store";
import { contentTypes, toneOptions, calculateReadabilityScore, calculateReadingTime, generateId } from "@/lib/utils";
import type { ContentType, ToneOption } from "@/lib/utils";

export default function EditorPage() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as ContentType) || "blog";
  
  const {
    content,
    setContent,
    title,
    setTitle,
    type,
    setType,
    tone,
    setTone,
    keywords,
    addKeyword,
    removeKeyword,
    isGenerating,
    setIsGenerating,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    isDirty,
    setIsDirty,
    reset,
  } = useEditorStore();

  const { addItem, setSaving, setLastSaved } = useContentStore();

  const [newKeyword, setNewKeyword] = React.useState("");
  const [targetAudience, setTargetAudience] = React.useState("");
  const [includeNigerianContext, setIncludeNigerianContext] = React.useState(true);
  const [contentLength, setContentLength] = React.useState<"short" | "medium" | "long">("medium");
  const [generatedMetadata, setGeneratedMetadata] = React.useState<{
    seoTitle?: string;
    seoDescription?: string;
    suggestedKeywords?: string[];
    hashtags?: string[];
    readabilityScore?: number;
  }>({});

  // Initialize type from URL params
  React.useEffect(() => {
    if (initialType) {
      setType(initialType);
    }
  }, [initialType, setType]);

  // Fetch suggestions as user types (debounced)
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (content.length > 50 && !isGenerating) {
        try {
          const response = await fetch("/api/ai/suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, type }),
          });
          const data = await response.json();
          if (data.suggestions?.length) {
            setSuggestions(data.suggestions);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, type, isGenerating, setSuggestions, setShowSuggestions]);

  const handleGenerate = async () => {
    if (!title.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          topic: title,
          tone,
          keywords,
          targetAudience,
          length: contentLength,
          includeNigerianContext,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setContent(data.content || "");
      setGeneratedMetadata({
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        suggestedKeywords: data.suggestedKeywords,
        hashtags: data.hashtags,
        readabilityScore: data.readabilityScore,
      });

      if (data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const contentItem = {
        id: generateId(),
        title,
        content,
        type,
        status: "draft" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          keywords,
          seoTitle: generatedMetadata.seoTitle,
          seoDescription: generatedMetadata.seoDescription,
          readabilityScore: generatedMetadata.readabilityScore || calculateReadabilityScore(content),
          wordCount: content.split(/\s+/).filter(Boolean).length,
          readingTime: calculateReadingTime(content),
        },
      };

      // Save to backend
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentItem),
      });

      addItem(contentItem);
      setLastSaved(new Date().toISOString());
      setIsDirty(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      addKeyword(newKeyword.trim());
      setNewKeyword("");
    }
  };

  const applySuggestion = (suggestion: string) => {
    setContent(content + " " + suggestion);
    setShowSuggestions(false);
  };

  const readabilityScore = content ? calculateReadabilityScore(content) : 0;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = calculateReadingTime(content);

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-6">
      {/* Main Editor */}
      <div className="space-y-6">
        {/* Content Type Tabs */}
        <Tabs value={type} onValueChange={(v) => setType(v as ContentType)}>
          <TabsList className="w-full justify-start bg-transparent gap-2 p-0">
            {contentTypes.map((ct) => (
              <TabsTrigger
                key={ct.id}
                value={ct.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4"
              >
                {ct.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title">Topic / Title</Label>
          <Input
            id="title"
            placeholder="What do you want to write about?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg h-12"
          />
        </div>

        {/* AI Generate Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
          {isDirty && (
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          )}
        </div>

        {/* AI Thinking Animation */}
        <AIThinking isVisible={isGenerating} message="Creating your content..." />

        {/* Content Editor */}
        <GlassCard className="relative">
          <Textarea
            placeholder="Your content will appear here, or start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] text-base leading-relaxed border-0 focus-visible:ring-0 bg-transparent resize-none"
          />

          {/* Live Suggestions Panel */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <GlassCard className="p-4 border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Suggestions</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full text-left p-2 rounded-lg hover:bg-accent text-sm transition-colors"
                      >
                        <ChevronRight className="h-3 w-3 inline mr-2 text-primary" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Content Stats */}
        {content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-6 text-sm text-muted-foreground"
          >
            <span>{wordCount} words</span>
            <span>{readingTime} min read</span>
            <div className="flex items-center gap-2">
              <span>Readability:</span>
              <Badge
                variant={
                  readabilityScore >= 70
                    ? "success"
                    : readabilityScore >= 50
                    ? "warning"
                    : "destructive"
                }
              >
                {readabilityScore}
              </Badge>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Sidebar - Settings */}
      <div className="space-y-6">
        {/* Generation Settings */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Generation Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Tone */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as ToneOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Length */}
            <div className="space-y-2">
              <Label>Content Length</Label>
              <Select value={contentLength} onValueChange={(v: "short" | "medium" | "long") => setContentLength(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <Label>
                <Target className="h-4 w-4 inline mr-2" />
                Target Audience
              </Label>
              <Input
                placeholder="e.g., Nigerian entrepreneurs"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            {/* Nigerian Context Toggle */}
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Nigerian Context
              </Label>
              <Switch
                checked={includeNigerianContext}
                onCheckedChange={setIncludeNigerianContext}
              />
            </div>
          </div>
        </GlassCard>

        {/* Keywords */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Keywords</h3>
          </div>

          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Add keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddKeyword()}
            />
            <Button variant="outline" size="icon" onClick={handleAddKeyword}>
              <Check className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <Badge key={kw} variant="secondary" className="gap-1">
                {kw}
                <button onClick={() => removeKeyword(kw)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {generatedMetadata.suggestedKeywords?.map((kw) => (
              <Badge
                key={kw}
                variant="outline"
                className="gap-1 cursor-pointer hover:bg-accent"
                onClick={() => addKeyword(kw)}
              >
                + {kw}
              </Badge>
            ))}
          </div>
        </GlassCard>

        {/* SEO Preview */}
        {(generatedMetadata.seoTitle || generatedMetadata.seoDescription) && (
          <GlassCard>
            <h3 className="font-semibold mb-4">SEO Preview</h3>
            <div className="space-y-2 p-3 bg-background rounded-lg">
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium line-clamp-1">
                {generatedMetadata.seoTitle || title}
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                afrocreate.ai/content/{title.toLowerCase().replace(/\s+/g, "-")}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {generatedMetadata.seoDescription || content.slice(0, 160)}
              </p>
            </div>
          </GlassCard>
        )}

        {/* Generated Hashtags */}
        {generatedMetadata.hashtags && generatedMetadata.hashtags.length > 0 && (
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Suggested Hashtags</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedMetadata.hashtags!.join(" "));
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {generatedMetadata.hashtags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}

