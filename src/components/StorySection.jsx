import React from 'react';
import { Sparkles, Video, FileText, ExternalLink, Quote, Film } from 'lucide-react';

export default function StorySection({ product }) {
  const { story_text, story_video_url, story_document_url, story_document_name, seller, name } = product;
  const hasStory = Boolean(story_text || story_video_url || story_document_url);
  const sellerName = seller?.name || 'The Artisan';

  return (
    <div className="bg-cream-100/70 border border-cream-200 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs">
      {/* Subtle decorative background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-100/40 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shadow-sm">
          <Sparkles className="w-5 h-5 text-amber-200" />
        </div>
        <div>
          <span className="text-xs uppercase font-semibold tracking-wider text-terracotta-600 block">
            Personal Heritage Journey
          </span>
          <h2 className="font-display font-bold text-2xl text-earth-900">
            Behind the Art — The Story of Its Creator
          </h2>
        </div>
      </div>

      {!hasStory ? (
        <div className="bg-white/60 rounded-2xl p-6 text-center border border-dashed border-cream-300">
          <p className="text-earth-800/70 text-sm">
            The artisan has not shared a personal story for this creation yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Written Story */}
          {story_text && (
            <div className="bg-white rounded-2xl p-6 border border-cream-200 shadow-xs relative">
              <Quote className="w-8 h-8 text-terracotta-200 absolute top-4 right-4 -scale-x-100 opacity-60" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-earth-800/60 mb-2">
                In the Artisan's Words
              </h4>
              <p className="text-earth-900 text-base md:text-lg font-serif italic leading-relaxed whitespace-pre-line relative z-10">
                "{story_text}"
              </p>
              <div className="mt-4 pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-earth-800/70">
                <span className="font-medium text-earth-900">— {sellerName}</span>
                <span>Crafted in {product.state}</span>
              </div>
            </div>
          )}

          {/* Story Video Player */}
          {story_video_url && (
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-earth-900 font-semibold text-sm">
                <Film className="w-4 h-4 text-terracotta-500" />
                <span>Artisan Studio Video / Creation Footage</span>
              </div>
              <div className="rounded-xl overflow-hidden bg-black aspect-video max-h-[420px] mx-auto shadow-inner">
                <video
                  src={story_video_url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="text-xs text-earth-800/60 mt-2 text-center">
                Watch the artisan describe their techniques and generational craft philosophy.
              </p>
            </div>
          )}

          {/* Story Document Link */}
          {story_document_url && (
            <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-terracotta-50 text-terracotta-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium text-earth-900 text-sm">
                    {story_document_name || "Artisan's Heritage & Craft Document"}
                  </h4>
                  <p className="text-xs text-earth-800/60">
                    Cultural backstory, craft origin certificate, or written poetry submitted by the artist.
                  </p>
                </div>
              </div>

              <a
                href={story_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium text-xs shadow-sm transition-all shrink-0"
              >
                <span>View Story Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
