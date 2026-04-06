import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FileText, Download, Trash2 } from 'lucide-react';

const Documents = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    api.file.getMyDocs().then(res => setDocs(res.data));
  }, []);

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-black text-white tracking-tight text-center sm:text-left">Kho tài liệu của tôi</h1>
      <div className="grid gap-4">
        {docs.map((doc: any) => (
          <div key={doc._id} className="bg-[#1e293b] p-6 rounded-[2rem] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 rounded-xl text-blue-400"><FileText/></div>
              <div>
                <p className="text-white font-bold">{doc.title}</p>
                <p className="text-slate-500 text-xs">{new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl"><Download size={18}/></button>
              <button className="p-3 bg-slate-800 text-red-400 hover:bg-red-500/10 rounded-xl"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Documents;