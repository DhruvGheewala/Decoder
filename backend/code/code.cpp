#if __has_include("debug.h")
    #include "debug.h"
#else
    #include<bits/stdc++.h>
    using namespace std;
    
    #define fundri 108
    #define debug(...) 1729
#endif

#define endl '\n'
#define int int64_t

typedef pair<int, int> pii;
typedef vector<int> vi;

mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
inline int rnd(int l = 0, int r = INT_MAX) {return uniform_int_distribution<int>(l, r)(rng);}

bool in_range(int x, int l, int r) {return l <= x && x <= r;}
template<typename H, typename ...T>void inp(H &head) {cin >> head;}
template<typename H, typename ...T>void inp(H &head, T &...tail) {cin >> head;inp(tail...);}
template<typename T>inline istream &operator >>(istream &in, vector<T> &a) {for(T &x : a)in >> x; return in;}
template<typename T, typename U>inline istream &operator >>(istream &in, pair<T, U> &a) {in >> a.first >> a.second; return in;}

// Multi-Dimension Vector
// Usage: vec<n, data-type> dp(dimention-1, dimention-2, ..., dimention-n, default = data-type())
template<int D, typename T> struct vec : public vector<vec<D - 1, T>>
{
    static_assert(D >= 1, "Vector dimensions must be greater than zero !!");
    template<typename... Args>
    vec(int n = 0, Args... args) : vector<vec<D - 1, T>>(n, vec<D - 1, T>(args...)){}
};

template<typename T> struct vec<1, T> : public vector<T> {vec(int n = 0, T val = T()) : vector<T>(n, val){}};

const int inf = 1e15;
const bool testcases = false;

void init_main()
{
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);

#ifdef DHRUV_GHEEWALA
    freopen("in.txt", "r", stdin);
    freopen("out.txt", "w", stdout);
    freopen("debug.txt", "w", stderr);
#endif
}

void solve(int tc)
{
    string s;
    cin >> s;
    cout << "Hello " << s << endl;
}

int32_t main(int32_t argc, char **argv)
{
    init_main();

    int TC = 1;
    if(testcases)
        cin >> TC;

    for(int tc = 1; tc <= TC; ++tc) {
        solve(tc);
        fundri;
    }
    return 0;
}