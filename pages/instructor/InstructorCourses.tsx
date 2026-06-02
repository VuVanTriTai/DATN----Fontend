import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Users, Play, GraduationCap, Clock,
  TrendingUp, Plus, Star
} from 'lucide-react';
import CourseActionMenu from '../../components/shared/CourseActionMenu';

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#0d1117] border border-white/5 rounded-[2rem] p-6 animate-pulse space-y-5">
    <div className="flex justify-between">
      <div className="w-8 h-8 bg-white/5 rounded-xl" />
      <div className="w-16 h-5 bg-white/5 rounded-lg" />
    </div>
    <div className="space-y-2">
      <div className="h-5 bg-white/5 rounded-lg w-3/4" />
      <div className="h-4 bg-white/5 rounded-lg w-1/2" />
    </div>
    <div className="h-10 bg-white/5 rounded-xl" />
  </div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const InstructorCourses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.instructor.getMyCourses();
      if (res.success) setCourses(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  return (
    <div className="p-8 space-y-8 text-white min-h-screen">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">Giảng viên</p>
          <h1 className="text-3xl font-black tracking-tight">Khoá học đang hướng dẫn</h1>
          <p className="text-slate-500 text-sm mt-1.5">Quản lý nội dung và theo dõi tiến độ học viên.</p>
        </div>
        <button
          onClick={() => navigate('/create-plan')}
          className="flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-900/30 active:scale-95"
        >
          <Plus size={18} /> Tạo lộ trình AI
        </button>
      </div>

      {/* ── Stats Banner ── */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: <BookOpen size={20} className="text-purple-400" />, label: 'Tổng khoá học', value: courses.length, color: 'bg-purple-500/5 border-purple-500/15' },
            { icon: <Users size={20} className="text-blue-400" />, label: 'Tổng học viên', value: totalStudents, color: 'bg-blue-500/5 border-blue-500/15' },
            { icon: <Star size={20} className="text-amber-400" />, label: 'Trên Marketplace', value: courses.filter(c => c.isPublic).length, color: 'bg-amber-500/5 border-amber-500/15' },
          ].map((stat, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${stat.color}`}>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">{stat.icon}</div>
              <div>
                <p className="text-2xl font-black text-white leading-none">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Course Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="bg-[#0d1117] border border-white/5 hover:border-purple-500/30 rounded-[2rem] p-6 transition-all group shadow-xl relative overflow-hidden hover:-translate-y-0.5 duration-200"
            >
              {/* BG Decor */}
              <div className="absolute -right-6 -top-6 text-purple-500/5 group-hover:text-purple-500/10 transition-colors duration-300">
                <GraduationCap size={100} />
              </div>

              <div className="relative z-10 space-y-5">
                {/* Top */}
                <div className="flex justify-between items-start">
                  <div onClick={(e) => e.stopPropagation()}>
                    <CourseActionMenu plan={course} onRefresh={fetchCourses} />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border
                    ${course.level === 'Hard'
                      ? 'bg-red-500/10 text-red-400 border-red-500/15'
                      : course.level === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/15'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15'}`}>
                    {course.level || 'Medium'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold mb-1.5 line-clamp-2 group-hover:text-purple-400 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                    <Users size={12} className="text-slate-600" />
                    Chủ sở hữu: {course.owner?.fullName || 'Học viên'}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 py-3 border-t border-b border-white/5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                    <Clock size={13} className="text-slate-600" />
                    {course.duration} ngày
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <TrendingUp size={13} className="text-emerald-500" />
                    <span className="text-emerald-400">{course.studentCount || 0} học viên</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate(`/instructor/course/${course._id}`)}
                  className="w-full py-3 bg-white/5 hover:bg-purple-600 border border-white/5 hover:border-purple-500 text-slate-300 hover:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Quản lý khoá học <Play size={14} fill="currentColor" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center rounded-[2.5rem] border border-dashed border-white/8 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto">
              <BookOpen size={28} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-400 font-bold">Bạn chưa được giao hướng dẫn khoá học nào.</p>
              <p className="text-slate-600 text-sm mt-1">Hãy tạo lộ trình để chia sẻ với học viên.</p>
            </div>
            <button
              onClick={() => navigate('/create-plan')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm transition-all"
            >
              <Plus size={16} /> Tạo lộ trình ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;