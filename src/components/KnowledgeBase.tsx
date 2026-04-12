import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { articles, Article } from '../lib/knowledgeData';

export function KnowledgeBase({ onClose }: { onClose: () => void }) {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(article => 
    article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category[language].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl h-[85vh] flex flex-col bg-[#110e0c] border border-amber-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-amber-500/10 bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
            {selectedArticle ? (
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full hover:bg-white/5 text-amber-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <BookOpen size={20} />
              </div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl text-amber-100 font-medium tracking-wider uppercase">
                {selectedArticle ? selectedArticle.category[language] : t('knowledge.title')}
              </h2>
              {!selectedArticle && (
                <p className="text-amber-100/40 text-[10px] uppercase tracking-[0.2em]">
                  {t('knowledge.subtitle')}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <motion.div
                key="article-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title[language]} 
                  className="w-full h-64 object-cover rounded-2xl mb-8 shadow-2xl border border-white/5"
                />
                <h1 className="text-2xl sm:text-3xl text-amber-100 font-light leading-tight mb-6">
                  {selectedArticle.title[language]}
                </h1>
                <div className="prose prose-invert prose-amber max-w-none">
                  <div className="text-amber-100/80 leading-relaxed whitespace-pre-line text-sm sm:text-base font-light">
                    {selectedArticle.content[language]}
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/5 flex justify-center">
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="px-8 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm tracking-widest uppercase hover:bg-amber-500/20 transition-all"
                  >
                    {t('knowledge.back_to_list')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="article-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mb-12">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text"
                    placeholder={t('knowledge.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-amber-100 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedArticle(article)}
                      className="group cursor-pointer bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title[language]} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-amber-500 text-[10px] uppercase tracking-widest mb-2 block">
                          {article.category[language]}
                        </span>
                        <h3 className="text-lg text-amber-100 font-light mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors">
                          {article.title[language]}
                        </h3>
                        <p className="text-white/40 text-xs leading-relaxed line-clamp-3 mb-4">
                          {article.excerpt[language]}
                        </p>
                        <div className="flex items-center gap-2 text-amber-500/60 text-[10px] uppercase tracking-widest font-medium group-hover:text-amber-500 transition-colors">
                          {t('knowledge.read_more')}
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-white/20 uppercase tracking-widest text-sm">
                      {t('knowledge.no_results')}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
