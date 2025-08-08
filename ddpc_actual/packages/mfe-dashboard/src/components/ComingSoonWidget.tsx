import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'shared_ui/card';
import { Sparkles, Zap, Wrench, ArrowRight } from 'lucide-react';

export const ComingSoonWidget: React.FC = () => {
  return (
    <Card className="flex flex-col border-slate-700 bg-slate-900/50">
      <CardHeader className="p-4 pb-2 border-b border-slate-700">
        <CardTitle className="text-base font-semibold text-white flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-purple-400" />
          Coming Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-20 blur-lg"></div>
                <div className="relative bg-slate-800/80 border border-slate-700 rounded-full p-3 inline-flex">
                  <Zap className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white">Exciting New Features</h3>
              <p className="text-slate-300 text-sm">
                We're working on some amazing new tools to take your car care to the next level. Stay tuned for updates!
              </p>
            </div>
            <div className="space-y-3">
            <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="bg-blue-500/20 p-1.5 rounded-md mr-3">
                <Wrench className="h-4 w-4 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Advanced Analytics</p>
                <p className="text-xs text-slate-400">Track performance metrics</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-lg p-3 opacity-60">
              <div className="bg-purple-500/20 p-1.5 rounded-md mr-3">
                <Zap className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-400">Mobile App</p>
                <p className="text-xs text-slate-500">Coming soon</p>
              </div>
            </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-700 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">What would you like to see next?</span>
            <button 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center"
              onClick={() => window.location.href = '/feedback'}
            >
              Suggest a feature <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComingSoonWidget;
