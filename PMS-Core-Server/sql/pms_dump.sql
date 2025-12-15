--
-- PostgreSQL database dump
--

\restrict 6un77KUihWDnWv8rrLlk2G9SuXVr505V9LgXgGykjlRBpMQQTlMDkRmMdiI8D2H

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: gates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gates (
    id integer NOT NULL,
    map_id character varying NOT NULL,
    gate_type character varying NOT NULL,
    label character varying,
    x double precision NOT NULL,
    y double precision NOT NULL,
    z double precision NOT NULL
);


ALTER TABLE public.gates OWNER TO postgres;

--
-- Name: gates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.gates_id_seq OWNER TO postgres;

--
-- Name: gates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gates_id_seq OWNED BY public.gates.id;


--
-- Name: map_configs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.map_configs (
    id integer NOT NULL,
    map_id character varying,
    name character varying NOT NULL,
    description character varying,
    capacity integer,
    base_rate double precision,
    unit_minutes integer,
    free_minutes integer,
    max_daily_fee double precision,
    misc_config json NOT NULL,
    is_active boolean
);


ALTER TABLE public.map_configs OWNER TO postgres;

--
-- Name: map_configs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.map_configs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.map_configs_id_seq OWNER TO postgres;

--
-- Name: map_configs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.map_configs_id_seq OWNED BY public.map_configs.id;


--
-- Name: parking_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_events (
    id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time timestamp with time zone DEFAULT now() NOT NULL,
    exit_time timestamp with time zone,
    parking_spot character varying,
    map_id character varying NOT NULL,
    is_parked boolean
);


ALTER TABLE public.parking_events OWNER TO postgres;

--
-- Name: parking_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parking_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parking_events_id_seq OWNER TO postgres;

--
-- Name: parking_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parking_events_id_seq OWNED BY public.parking_events.id;


--
-- Name: parking_spots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parking_spots (
    id integer NOT NULL,
    map_id character varying NOT NULL,
    spot_index integer NOT NULL,
    x double precision NOT NULL,
    y double precision NOT NULL,
    z double precision NOT NULL
);


ALTER TABLE public.parking_spots OWNER TO postgres;

--
-- Name: parking_spots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parking_spots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parking_spots_id_seq OWNER TO postgres;

--
-- Name: parking_spots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parking_spots_id_seq OWNED BY public.parking_spots.id;


--
-- Name: pricing_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pricing_policies (
    id integer NOT NULL,
    policy_name character varying NOT NULL,
    free_minutes integer,
    base_rate double precision,
    unit_minutes integer,
    max_daily_fee double precision,
    re_entry_limit integer,
    capacity integer,
    is_active boolean
);


ALTER TABLE public.pricing_policies OWNER TO postgres;

--
-- Name: pricing_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pricing_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pricing_policies_id_seq OWNER TO postgres;

--
-- Name: pricing_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pricing_policies_id_seq OWNED BY public.pricing_policies.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    event_id integer NOT NULL,
    fee_calculated double precision NOT NULL,
    discount_applied double precision,
    fee_paid double precision NOT NULL,
    payment_method character varying,
    transaction_time timestamp with time zone DEFAULT now(),
    is_paid boolean
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    plate_number character varying NOT NULL,
    is_vip boolean,
    registered_until date,
    memo character varying
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO postgres;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: gates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gates ALTER COLUMN id SET DEFAULT nextval('public.gates_id_seq'::regclass);


--
-- Name: map_configs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_configs ALTER COLUMN id SET DEFAULT nextval('public.map_configs_id_seq'::regclass);


--
-- Name: parking_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_events ALTER COLUMN id SET DEFAULT nextval('public.parking_events_id_seq'::regclass);


--
-- Name: parking_spots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_spots ALTER COLUMN id SET DEFAULT nextval('public.parking_spots_id_seq'::regclass);


--
-- Name: pricing_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_policies ALTER COLUMN id SET DEFAULT nextval('public.pricing_policies_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Data for Name: gates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gates (id, map_id, gate_type, label, x, y, z) FROM stdin;
1	standard	entry	ENTRY	-8	0	12
2	standard	exit	EXIT	2	0	12
3	gangnam	entry	IN	-6	0	12
4	gangnam	exit	OUT	6	0	12
5	mall	entry	MALL IN	-5	0	15
6	mall	exit	MALL OUT	5	0	15
\.


--
-- Data for Name: map_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.map_configs (id, map_id, name, description, capacity, base_rate, unit_minutes, free_minutes, max_daily_fee, misc_config, is_active) FROM stdin;
1	standard	Standard Lot	Basic 1-row parking lot	5	1000	60	30	20000	{"camera": {"position": [0, 15, 25], "fov": 50}, "paths": {"entry_start": [-8, 0, 20], "entry_gate": [-8, 0, 12], "exit_gate": [2, 0, 12], "exit_end": [2, 0, 20]}}	t
2	gangnam	Gangnam Tower	2-row busy parking lot	10	1500	10	5	80000	{"camera": {"position": [0, 25, 30], "fov": 55}, "paths": {"entry_start": [-6, 0, 22], "entry_gate": [-6, 0, 12], "exit_gate": [6, 0, 12], "exit_end": [6, 0, 22]}}	t
3	mall	The Hyundai Seoul (Parc1)	Mega Scale (B3-B6) | 1000+ Cap	1000	2000	10	30	50000	{"camera": {"position": [0, 100, 120], "fov": 50}, "paths": {"entry_start": [0, 0, 65], "entry_gate": [0, 0, 55], "exit_gate": [10, 0, 55], "exit_end": [10, 0, 65]}}	t
\.


--
-- Data for Name: parking_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parking_events (id, vehicle_id, entry_time, exit_time, parking_spot, map_id, is_parked) FROM stdin;
1	1	2025-12-15 11:49:28.369978+00	\N	TBD	standard	t
3	3	2025-12-15 11:49:33.102764+00	\N	TBD	standard	t
4	4	2025-12-15 11:49:33.536857+00	\N	TBD	standard	t
5	5	2025-12-15 11:49:34.122621+00	\N	TBD	standard	t
2	2	2025-12-15 11:49:32.818963+00	2025-12-15 11:49:50.094433+00	TBD	standard	f
\.


--
-- Data for Name: parking_spots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.parking_spots (id, map_id, spot_index, x, y, z) FROM stdin;
1	standard	0	-6	0	-5
2	standard	1	-3	0	-5
3	standard	2	0	0	-5
4	standard	3	3	0	-5
5	standard	4	6	0	-5
6	gangnam	0	-8	0	-8
7	gangnam	1	-4	0	-8
8	gangnam	2	0	0	-8
9	gangnam	3	4	0	-8
10	gangnam	4	8	0	-8
11	gangnam	5	-8	0	0
12	gangnam	6	-4	0	0
13	gangnam	7	0	0	0
14	gangnam	8	4	0	0
15	gangnam	9	8	0	0
16	mall	0	-46.5	-12	-48
17	mall	1	-43.5	-12	-48
18	mall	2	-46.5	-12	-44
19	mall	3	-43.5	-12	-44
20	mall	4	-46.5	-12	-40
21	mall	5	-43.5	-12	-40
22	mall	6	-46.5	-12	-36
23	mall	7	-43.5	-12	-36
24	mall	8	-46.5	-12	-32
25	mall	9	-43.5	-12	-32
26	mall	10	-46.5	-12	-28
27	mall	11	-43.5	-12	-28
28	mall	12	-46.5	-12	-24
29	mall	13	-43.5	-12	-24
30	mall	14	-46.5	-12	-20
31	mall	15	-43.5	-12	-20
32	mall	16	-46.5	-12	-16
33	mall	17	-43.5	-12	-16
34	mall	18	-46.5	-12	-12
35	mall	19	-43.5	-12	-12
36	mall	20	-46.5	-12	-8
37	mall	21	-43.5	-12	-8
38	mall	22	-46.5	-12	8
39	mall	23	-43.5	-12	8
40	mall	24	-46.5	-12	12
41	mall	25	-43.5	-12	12
42	mall	26	-46.5	-12	16
43	mall	27	-43.5	-12	16
44	mall	28	-46.5	-12	20
45	mall	29	-43.5	-12	20
46	mall	30	-46.5	-12	24
47	mall	31	-43.5	-12	24
48	mall	32	-46.5	-12	28
49	mall	33	-43.5	-12	28
50	mall	34	-46.5	-12	32
51	mall	35	-43.5	-12	32
52	mall	36	-46.5	-12	36
53	mall	37	-43.5	-12	36
54	mall	38	-46.5	-12	40
55	mall	39	-43.5	-12	40
56	mall	40	-46.5	-12	44
57	mall	41	-43.5	-12	44
58	mall	42	-46.5	-12	48
59	mall	43	-43.5	-12	48
60	mall	44	-36.5	-12	-48
61	mall	45	-33.5	-12	-48
62	mall	46	-36.5	-12	-44
63	mall	47	-33.5	-12	-44
64	mall	48	-36.5	-12	-40
65	mall	49	-33.5	-12	-40
66	mall	50	-36.5	-12	-36
67	mall	51	-33.5	-12	-36
68	mall	52	-36.5	-12	-32
69	mall	53	-33.5	-12	-32
70	mall	54	-36.5	-12	-28
71	mall	55	-33.5	-12	-28
72	mall	56	-36.5	-12	-24
73	mall	57	-33.5	-12	-24
74	mall	58	-36.5	-12	-20
75	mall	59	-33.5	-12	-20
76	mall	60	-36.5	-12	-16
77	mall	61	-33.5	-12	-16
78	mall	62	-36.5	-12	-12
79	mall	63	-33.5	-12	-12
80	mall	64	-36.5	-12	-8
81	mall	65	-33.5	-12	-8
82	mall	66	-36.5	-12	8
83	mall	67	-33.5	-12	8
84	mall	68	-36.5	-12	12
85	mall	69	-33.5	-12	12
86	mall	70	-36.5	-12	16
87	mall	71	-33.5	-12	16
88	mall	72	-36.5	-12	20
89	mall	73	-33.5	-12	20
90	mall	74	-36.5	-12	24
91	mall	75	-33.5	-12	24
92	mall	76	-36.5	-12	28
93	mall	77	-33.5	-12	28
94	mall	78	-36.5	-12	32
95	mall	79	-33.5	-12	32
96	mall	80	-36.5	-12	36
97	mall	81	-33.5	-12	36
98	mall	82	-36.5	-12	40
99	mall	83	-33.5	-12	40
100	mall	84	-36.5	-12	44
101	mall	85	-33.5	-12	44
102	mall	86	-36.5	-12	48
103	mall	87	-33.5	-12	48
104	mall	88	-26.5	-12	-48
105	mall	89	-23.5	-12	-48
106	mall	90	-26.5	-12	-44
107	mall	91	-23.5	-12	-44
108	mall	92	-26.5	-12	-40
109	mall	93	-23.5	-12	-40
110	mall	94	-26.5	-12	-36
111	mall	95	-23.5	-12	-36
112	mall	96	-26.5	-12	-32
113	mall	97	-23.5	-12	-32
114	mall	98	-26.5	-12	-28
115	mall	99	-23.5	-12	-28
116	mall	100	-26.5	-12	-24
117	mall	101	-23.5	-12	-24
118	mall	102	-26.5	-12	-20
119	mall	103	-23.5	-12	-20
120	mall	104	-26.5	-12	-16
121	mall	105	-23.5	-12	-16
122	mall	106	-26.5	-12	-12
123	mall	107	-23.5	-12	-12
124	mall	108	-26.5	-12	-8
125	mall	109	-23.5	-12	-8
126	mall	110	-26.5	-12	8
127	mall	111	-23.5	-12	8
128	mall	112	-26.5	-12	12
129	mall	113	-23.5	-12	12
130	mall	114	-26.5	-12	16
131	mall	115	-23.5	-12	16
132	mall	116	-26.5	-12	20
133	mall	117	-23.5	-12	20
134	mall	118	-26.5	-12	24
135	mall	119	-23.5	-12	24
136	mall	120	-26.5	-12	28
137	mall	121	-23.5	-12	28
138	mall	122	-26.5	-12	32
139	mall	123	-23.5	-12	32
140	mall	124	-26.5	-12	36
141	mall	125	-23.5	-12	36
142	mall	126	-26.5	-12	40
143	mall	127	-23.5	-12	40
144	mall	128	-26.5	-12	44
145	mall	129	-23.5	-12	44
146	mall	130	-26.5	-12	48
147	mall	131	-23.5	-12	48
148	mall	132	-16.5	-12	-48
149	mall	133	-13.5	-12	-48
150	mall	134	-16.5	-12	-44
151	mall	135	-13.5	-12	-44
152	mall	136	-16.5	-12	-40
153	mall	137	-13.5	-12	-40
154	mall	138	-16.5	-12	-36
155	mall	139	-13.5	-12	-36
156	mall	140	-16.5	-12	-32
157	mall	141	-13.5	-12	-32
158	mall	142	-16.5	-12	-28
159	mall	143	-13.5	-12	-28
160	mall	144	-16.5	-12	-24
161	mall	145	-13.5	-12	-24
162	mall	146	-16.5	-12	-20
163	mall	147	-13.5	-12	-20
164	mall	148	-16.5	-12	-16
165	mall	149	-13.5	-12	-16
166	mall	150	-16.5	-12	-12
167	mall	151	-13.5	-12	-12
168	mall	152	-16.5	-12	-8
169	mall	153	-13.5	-12	-8
170	mall	154	-16.5	-12	8
171	mall	155	-13.5	-12	8
172	mall	156	-16.5	-12	12
173	mall	157	-13.5	-12	12
174	mall	158	-16.5	-12	16
175	mall	159	-13.5	-12	16
176	mall	160	-16.5	-12	20
177	mall	161	-13.5	-12	20
178	mall	162	-16.5	-12	24
179	mall	163	-13.5	-12	24
180	mall	164	-16.5	-12	28
181	mall	165	-13.5	-12	28
182	mall	166	-16.5	-12	32
183	mall	167	-13.5	-12	32
184	mall	168	-16.5	-12	36
185	mall	169	-13.5	-12	36
186	mall	170	-16.5	-12	40
187	mall	171	-13.5	-12	40
188	mall	172	-16.5	-12	44
189	mall	173	-13.5	-12	44
190	mall	174	-16.5	-12	48
191	mall	175	-13.5	-12	48
192	mall	176	13.5	-12	-48
193	mall	177	16.5	-12	-48
194	mall	178	13.5	-12	-44
195	mall	179	16.5	-12	-44
196	mall	180	13.5	-12	-40
197	mall	181	16.5	-12	-40
198	mall	182	13.5	-12	-36
199	mall	183	16.5	-12	-36
200	mall	184	13.5	-12	-32
201	mall	185	16.5	-12	-32
202	mall	186	13.5	-12	-28
203	mall	187	16.5	-12	-28
204	mall	188	13.5	-12	-24
205	mall	189	16.5	-12	-24
206	mall	190	13.5	-12	-20
207	mall	191	16.5	-12	-20
208	mall	192	13.5	-12	-16
209	mall	193	16.5	-12	-16
210	mall	194	13.5	-12	-12
211	mall	195	16.5	-12	-12
212	mall	196	13.5	-12	-8
213	mall	197	16.5	-12	-8
214	mall	198	13.5	-12	8
215	mall	199	16.5	-12	8
216	mall	200	13.5	-12	12
217	mall	201	16.5	-12	12
218	mall	202	13.5	-12	16
219	mall	203	16.5	-12	16
220	mall	204	13.5	-12	20
221	mall	205	16.5	-12	20
222	mall	206	13.5	-12	24
223	mall	207	16.5	-12	24
224	mall	208	13.5	-12	28
225	mall	209	16.5	-12	28
226	mall	210	13.5	-12	32
227	mall	211	16.5	-12	32
228	mall	212	13.5	-12	36
229	mall	213	16.5	-12	36
230	mall	214	13.5	-12	40
231	mall	215	16.5	-12	40
232	mall	216	13.5	-12	44
233	mall	217	16.5	-12	44
234	mall	218	13.5	-12	48
235	mall	219	16.5	-12	48
236	mall	220	23.5	-12	-48
237	mall	221	26.5	-12	-48
238	mall	222	23.5	-12	-44
239	mall	223	26.5	-12	-44
240	mall	224	23.5	-12	-40
241	mall	225	26.5	-12	-40
242	mall	226	23.5	-12	-36
243	mall	227	26.5	-12	-36
244	mall	228	23.5	-12	-32
245	mall	229	26.5	-12	-32
246	mall	230	23.5	-12	-28
247	mall	231	26.5	-12	-28
248	mall	232	23.5	-12	-24
249	mall	233	26.5	-12	-24
250	mall	234	23.5	-12	-20
251	mall	235	26.5	-12	-20
252	mall	236	23.5	-12	-16
253	mall	237	26.5	-12	-16
254	mall	238	23.5	-12	-12
255	mall	239	26.5	-12	-12
256	mall	240	23.5	-12	-8
257	mall	241	26.5	-12	-8
258	mall	242	23.5	-12	8
259	mall	243	26.5	-12	8
260	mall	244	23.5	-12	12
261	mall	245	26.5	-12	12
262	mall	246	23.5	-12	16
263	mall	247	26.5	-12	16
264	mall	248	23.5	-12	20
265	mall	249	26.5	-12	20
266	mall	250	23.5	-12	24
267	mall	251	26.5	-12	24
268	mall	252	23.5	-12	28
269	mall	253	26.5	-12	28
270	mall	254	23.5	-12	32
271	mall	255	26.5	-12	32
272	mall	256	23.5	-12	36
273	mall	257	26.5	-12	36
274	mall	258	23.5	-12	40
275	mall	259	26.5	-12	40
276	mall	260	23.5	-12	44
277	mall	261	26.5	-12	44
278	mall	262	23.5	-12	48
279	mall	263	26.5	-12	48
280	mall	264	33.5	-12	-48
281	mall	265	36.5	-12	-48
282	mall	266	33.5	-12	-44
283	mall	267	36.5	-12	-44
284	mall	268	33.5	-12	-40
285	mall	269	36.5	-12	-40
286	mall	270	33.5	-12	-36
287	mall	271	36.5	-12	-36
288	mall	272	33.5	-12	-32
289	mall	273	36.5	-12	-32
290	mall	274	33.5	-12	-28
291	mall	275	36.5	-12	-28
292	mall	276	33.5	-12	-24
293	mall	277	36.5	-12	-24
294	mall	278	33.5	-12	-20
295	mall	279	36.5	-12	-20
296	mall	280	33.5	-12	-16
297	mall	281	36.5	-12	-16
298	mall	282	33.5	-12	-12
299	mall	283	36.5	-12	-12
300	mall	284	33.5	-12	-8
301	mall	285	36.5	-12	-8
302	mall	286	33.5	-12	8
303	mall	287	36.5	-12	8
304	mall	288	33.5	-12	12
305	mall	289	36.5	-12	12
306	mall	290	33.5	-12	16
307	mall	291	36.5	-12	16
308	mall	292	33.5	-12	20
309	mall	293	36.5	-12	20
310	mall	294	33.5	-12	24
311	mall	295	36.5	-12	24
312	mall	296	33.5	-12	28
313	mall	297	36.5	-12	28
314	mall	298	33.5	-12	32
315	mall	299	36.5	-12	32
316	mall	300	33.5	-12	36
317	mall	301	36.5	-12	36
318	mall	302	33.5	-12	40
319	mall	303	36.5	-12	40
320	mall	304	33.5	-12	44
321	mall	305	36.5	-12	44
322	mall	306	33.5	-12	48
323	mall	307	36.5	-12	48
324	mall	308	43.5	-12	-48
325	mall	309	46.5	-12	-48
326	mall	310	43.5	-12	-44
327	mall	311	46.5	-12	-44
328	mall	312	43.5	-12	-40
329	mall	313	46.5	-12	-40
330	mall	314	43.5	-12	-36
331	mall	315	46.5	-12	-36
332	mall	316	43.5	-12	-32
333	mall	317	46.5	-12	-32
334	mall	318	43.5	-12	-28
335	mall	319	46.5	-12	-28
336	mall	320	43.5	-12	-24
337	mall	321	46.5	-12	-24
338	mall	322	43.5	-12	-20
339	mall	323	46.5	-12	-20
340	mall	324	43.5	-12	-16
341	mall	325	46.5	-12	-16
342	mall	326	43.5	-12	-12
343	mall	327	46.5	-12	-12
344	mall	328	43.5	-12	-8
345	mall	329	46.5	-12	-8
346	mall	330	43.5	-12	8
347	mall	331	46.5	-12	8
348	mall	332	43.5	-12	12
349	mall	333	46.5	-12	12
350	mall	334	43.5	-12	16
351	mall	335	46.5	-12	16
352	mall	336	43.5	-12	20
353	mall	337	46.5	-12	20
354	mall	338	43.5	-12	24
355	mall	339	46.5	-12	24
356	mall	340	43.5	-12	28
357	mall	341	46.5	-12	28
358	mall	342	43.5	-12	32
359	mall	343	46.5	-12	32
360	mall	344	43.5	-12	36
361	mall	345	46.5	-12	36
362	mall	346	43.5	-12	40
363	mall	347	46.5	-12	40
364	mall	348	43.5	-12	44
365	mall	349	46.5	-12	44
366	mall	350	43.5	-12	48
367	mall	351	46.5	-12	48
368	mall	352	-46.5	-18	-48
369	mall	353	-43.5	-18	-48
370	mall	354	-46.5	-18	-44
371	mall	355	-43.5	-18	-44
372	mall	356	-46.5	-18	-40
373	mall	357	-43.5	-18	-40
374	mall	358	-46.5	-18	-36
375	mall	359	-43.5	-18	-36
376	mall	360	-46.5	-18	-32
377	mall	361	-43.5	-18	-32
378	mall	362	-46.5	-18	-28
379	mall	363	-43.5	-18	-28
380	mall	364	-46.5	-18	-24
381	mall	365	-43.5	-18	-24
382	mall	366	-46.5	-18	-20
383	mall	367	-43.5	-18	-20
384	mall	368	-46.5	-18	-16
385	mall	369	-43.5	-18	-16
386	mall	370	-46.5	-18	-12
387	mall	371	-43.5	-18	-12
388	mall	372	-46.5	-18	-8
389	mall	373	-43.5	-18	-8
390	mall	374	-46.5	-18	8
391	mall	375	-43.5	-18	8
392	mall	376	-46.5	-18	12
393	mall	377	-43.5	-18	12
394	mall	378	-46.5	-18	16
395	mall	379	-43.5	-18	16
396	mall	380	-46.5	-18	20
397	mall	381	-43.5	-18	20
398	mall	382	-46.5	-18	24
399	mall	383	-43.5	-18	24
400	mall	384	-46.5	-18	28
401	mall	385	-43.5	-18	28
402	mall	386	-46.5	-18	32
403	mall	387	-43.5	-18	32
404	mall	388	-46.5	-18	36
405	mall	389	-43.5	-18	36
406	mall	390	-46.5	-18	40
407	mall	391	-43.5	-18	40
408	mall	392	-46.5	-18	44
409	mall	393	-43.5	-18	44
410	mall	394	-46.5	-18	48
411	mall	395	-43.5	-18	48
412	mall	396	-36.5	-18	-48
413	mall	397	-33.5	-18	-48
414	mall	398	-36.5	-18	-44
415	mall	399	-33.5	-18	-44
416	mall	400	-36.5	-18	-40
417	mall	401	-33.5	-18	-40
418	mall	402	-36.5	-18	-36
419	mall	403	-33.5	-18	-36
420	mall	404	-36.5	-18	-32
421	mall	405	-33.5	-18	-32
422	mall	406	-36.5	-18	-28
423	mall	407	-33.5	-18	-28
424	mall	408	-36.5	-18	-24
425	mall	409	-33.5	-18	-24
426	mall	410	-36.5	-18	-20
427	mall	411	-33.5	-18	-20
428	mall	412	-36.5	-18	-16
429	mall	413	-33.5	-18	-16
430	mall	414	-36.5	-18	-12
431	mall	415	-33.5	-18	-12
432	mall	416	-36.5	-18	-8
433	mall	417	-33.5	-18	-8
434	mall	418	-36.5	-18	8
435	mall	419	-33.5	-18	8
436	mall	420	-36.5	-18	12
437	mall	421	-33.5	-18	12
438	mall	422	-36.5	-18	16
439	mall	423	-33.5	-18	16
440	mall	424	-36.5	-18	20
441	mall	425	-33.5	-18	20
442	mall	426	-36.5	-18	24
443	mall	427	-33.5	-18	24
444	mall	428	-36.5	-18	28
445	mall	429	-33.5	-18	28
446	mall	430	-36.5	-18	32
447	mall	431	-33.5	-18	32
448	mall	432	-36.5	-18	36
449	mall	433	-33.5	-18	36
450	mall	434	-36.5	-18	40
451	mall	435	-33.5	-18	40
452	mall	436	-36.5	-18	44
453	mall	437	-33.5	-18	44
454	mall	438	-36.5	-18	48
455	mall	439	-33.5	-18	48
456	mall	440	-26.5	-18	-48
457	mall	441	-23.5	-18	-48
458	mall	442	-26.5	-18	-44
459	mall	443	-23.5	-18	-44
460	mall	444	-26.5	-18	-40
461	mall	445	-23.5	-18	-40
462	mall	446	-26.5	-18	-36
463	mall	447	-23.5	-18	-36
464	mall	448	-26.5	-18	-32
465	mall	449	-23.5	-18	-32
466	mall	450	-26.5	-18	-28
467	mall	451	-23.5	-18	-28
468	mall	452	-26.5	-18	-24
469	mall	453	-23.5	-18	-24
470	mall	454	-26.5	-18	-20
471	mall	455	-23.5	-18	-20
472	mall	456	-26.5	-18	-16
473	mall	457	-23.5	-18	-16
474	mall	458	-26.5	-18	-12
475	mall	459	-23.5	-18	-12
476	mall	460	-26.5	-18	-8
477	mall	461	-23.5	-18	-8
478	mall	462	-26.5	-18	8
479	mall	463	-23.5	-18	8
480	mall	464	-26.5	-18	12
481	mall	465	-23.5	-18	12
482	mall	466	-26.5	-18	16
483	mall	467	-23.5	-18	16
484	mall	468	-26.5	-18	20
485	mall	469	-23.5	-18	20
486	mall	470	-26.5	-18	24
487	mall	471	-23.5	-18	24
488	mall	472	-26.5	-18	28
489	mall	473	-23.5	-18	28
490	mall	474	-26.5	-18	32
491	mall	475	-23.5	-18	32
492	mall	476	-26.5	-18	36
493	mall	477	-23.5	-18	36
494	mall	478	-26.5	-18	40
495	mall	479	-23.5	-18	40
496	mall	480	-26.5	-18	44
497	mall	481	-23.5	-18	44
498	mall	482	-26.5	-18	48
499	mall	483	-23.5	-18	48
500	mall	484	-16.5	-18	-48
501	mall	485	-13.5	-18	-48
502	mall	486	-16.5	-18	-44
503	mall	487	-13.5	-18	-44
504	mall	488	-16.5	-18	-40
505	mall	489	-13.5	-18	-40
506	mall	490	-16.5	-18	-36
507	mall	491	-13.5	-18	-36
508	mall	492	-16.5	-18	-32
509	mall	493	-13.5	-18	-32
510	mall	494	-16.5	-18	-28
511	mall	495	-13.5	-18	-28
512	mall	496	-16.5	-18	-24
513	mall	497	-13.5	-18	-24
514	mall	498	-16.5	-18	-20
515	mall	499	-13.5	-18	-20
516	mall	500	-16.5	-18	-16
517	mall	501	-13.5	-18	-16
518	mall	502	-16.5	-18	-12
519	mall	503	-13.5	-18	-12
520	mall	504	-16.5	-18	-8
521	mall	505	-13.5	-18	-8
522	mall	506	-16.5	-18	8
523	mall	507	-13.5	-18	8
524	mall	508	-16.5	-18	12
525	mall	509	-13.5	-18	12
526	mall	510	-16.5	-18	16
527	mall	511	-13.5	-18	16
528	mall	512	-16.5	-18	20
529	mall	513	-13.5	-18	20
530	mall	514	-16.5	-18	24
531	mall	515	-13.5	-18	24
532	mall	516	-16.5	-18	28
533	mall	517	-13.5	-18	28
534	mall	518	-16.5	-18	32
535	mall	519	-13.5	-18	32
536	mall	520	-16.5	-18	36
537	mall	521	-13.5	-18	36
538	mall	522	-16.5	-18	40
539	mall	523	-13.5	-18	40
540	mall	524	-16.5	-18	44
541	mall	525	-13.5	-18	44
542	mall	526	-16.5	-18	48
543	mall	527	-13.5	-18	48
544	mall	528	13.5	-18	-48
545	mall	529	16.5	-18	-48
546	mall	530	13.5	-18	-44
547	mall	531	16.5	-18	-44
548	mall	532	13.5	-18	-40
549	mall	533	16.5	-18	-40
550	mall	534	13.5	-18	-36
551	mall	535	16.5	-18	-36
552	mall	536	13.5	-18	-32
553	mall	537	16.5	-18	-32
554	mall	538	13.5	-18	-28
555	mall	539	16.5	-18	-28
556	mall	540	13.5	-18	-24
557	mall	541	16.5	-18	-24
558	mall	542	13.5	-18	-20
559	mall	543	16.5	-18	-20
560	mall	544	13.5	-18	-16
561	mall	545	16.5	-18	-16
562	mall	546	13.5	-18	-12
563	mall	547	16.5	-18	-12
564	mall	548	13.5	-18	-8
565	mall	549	16.5	-18	-8
566	mall	550	13.5	-18	8
567	mall	551	16.5	-18	8
568	mall	552	13.5	-18	12
569	mall	553	16.5	-18	12
570	mall	554	13.5	-18	16
571	mall	555	16.5	-18	16
572	mall	556	13.5	-18	20
573	mall	557	16.5	-18	20
574	mall	558	13.5	-18	24
575	mall	559	16.5	-18	24
576	mall	560	13.5	-18	28
577	mall	561	16.5	-18	28
578	mall	562	13.5	-18	32
579	mall	563	16.5	-18	32
580	mall	564	13.5	-18	36
581	mall	565	16.5	-18	36
582	mall	566	13.5	-18	40
583	mall	567	16.5	-18	40
584	mall	568	13.5	-18	44
585	mall	569	16.5	-18	44
586	mall	570	13.5	-18	48
587	mall	571	16.5	-18	48
588	mall	572	23.5	-18	-48
589	mall	573	26.5	-18	-48
590	mall	574	23.5	-18	-44
591	mall	575	26.5	-18	-44
592	mall	576	23.5	-18	-40
593	mall	577	26.5	-18	-40
594	mall	578	23.5	-18	-36
595	mall	579	26.5	-18	-36
596	mall	580	23.5	-18	-32
597	mall	581	26.5	-18	-32
598	mall	582	23.5	-18	-28
599	mall	583	26.5	-18	-28
600	mall	584	23.5	-18	-24
601	mall	585	26.5	-18	-24
602	mall	586	23.5	-18	-20
603	mall	587	26.5	-18	-20
604	mall	588	23.5	-18	-16
605	mall	589	26.5	-18	-16
606	mall	590	23.5	-18	-12
607	mall	591	26.5	-18	-12
608	mall	592	23.5	-18	-8
609	mall	593	26.5	-18	-8
610	mall	594	23.5	-18	8
611	mall	595	26.5	-18	8
612	mall	596	23.5	-18	12
613	mall	597	26.5	-18	12
614	mall	598	23.5	-18	16
615	mall	599	26.5	-18	16
616	mall	600	23.5	-18	20
617	mall	601	26.5	-18	20
618	mall	602	23.5	-18	24
619	mall	603	26.5	-18	24
620	mall	604	23.5	-18	28
621	mall	605	26.5	-18	28
622	mall	606	23.5	-18	32
623	mall	607	26.5	-18	32
624	mall	608	23.5	-18	36
625	mall	609	26.5	-18	36
626	mall	610	23.5	-18	40
627	mall	611	26.5	-18	40
628	mall	612	23.5	-18	44
629	mall	613	26.5	-18	44
630	mall	614	23.5	-18	48
631	mall	615	26.5	-18	48
632	mall	616	33.5	-18	-48
633	mall	617	36.5	-18	-48
634	mall	618	33.5	-18	-44
635	mall	619	36.5	-18	-44
636	mall	620	33.5	-18	-40
637	mall	621	36.5	-18	-40
638	mall	622	33.5	-18	-36
639	mall	623	36.5	-18	-36
640	mall	624	33.5	-18	-32
641	mall	625	36.5	-18	-32
642	mall	626	33.5	-18	-28
643	mall	627	36.5	-18	-28
644	mall	628	33.5	-18	-24
645	mall	629	36.5	-18	-24
646	mall	630	33.5	-18	-20
647	mall	631	36.5	-18	-20
648	mall	632	33.5	-18	-16
649	mall	633	36.5	-18	-16
650	mall	634	33.5	-18	-12
651	mall	635	36.5	-18	-12
652	mall	636	33.5	-18	-8
653	mall	637	36.5	-18	-8
654	mall	638	33.5	-18	8
655	mall	639	36.5	-18	8
656	mall	640	33.5	-18	12
657	mall	641	36.5	-18	12
658	mall	642	33.5	-18	16
659	mall	643	36.5	-18	16
660	mall	644	33.5	-18	20
661	mall	645	36.5	-18	20
662	mall	646	33.5	-18	24
663	mall	647	36.5	-18	24
664	mall	648	33.5	-18	28
665	mall	649	36.5	-18	28
666	mall	650	33.5	-18	32
667	mall	651	36.5	-18	32
668	mall	652	33.5	-18	36
669	mall	653	36.5	-18	36
670	mall	654	33.5	-18	40
671	mall	655	36.5	-18	40
672	mall	656	33.5	-18	44
673	mall	657	36.5	-18	44
674	mall	658	33.5	-18	48
675	mall	659	36.5	-18	48
676	mall	660	43.5	-18	-48
677	mall	661	46.5	-18	-48
678	mall	662	43.5	-18	-44
679	mall	663	46.5	-18	-44
680	mall	664	43.5	-18	-40
681	mall	665	46.5	-18	-40
682	mall	666	43.5	-18	-36
683	mall	667	46.5	-18	-36
684	mall	668	43.5	-18	-32
685	mall	669	46.5	-18	-32
686	mall	670	43.5	-18	-28
687	mall	671	46.5	-18	-28
688	mall	672	43.5	-18	-24
689	mall	673	46.5	-18	-24
690	mall	674	43.5	-18	-20
691	mall	675	46.5	-18	-20
692	mall	676	43.5	-18	-16
693	mall	677	46.5	-18	-16
694	mall	678	43.5	-18	-12
695	mall	679	46.5	-18	-12
696	mall	680	43.5	-18	-8
697	mall	681	46.5	-18	-8
698	mall	682	43.5	-18	8
699	mall	683	46.5	-18	8
700	mall	684	43.5	-18	12
701	mall	685	46.5	-18	12
702	mall	686	43.5	-18	16
703	mall	687	46.5	-18	16
704	mall	688	43.5	-18	20
705	mall	689	46.5	-18	20
706	mall	690	43.5	-18	24
707	mall	691	46.5	-18	24
708	mall	692	43.5	-18	28
709	mall	693	46.5	-18	28
710	mall	694	43.5	-18	32
711	mall	695	46.5	-18	32
712	mall	696	43.5	-18	36
713	mall	697	46.5	-18	36
714	mall	698	43.5	-18	40
715	mall	699	46.5	-18	40
716	mall	700	43.5	-18	44
717	mall	701	46.5	-18	44
718	mall	702	43.5	-18	48
719	mall	703	46.5	-18	48
720	mall	704	-46.5	-24	-48
721	mall	705	-43.5	-24	-48
722	mall	706	-46.5	-24	-44
723	mall	707	-43.5	-24	-44
724	mall	708	-46.5	-24	-40
725	mall	709	-43.5	-24	-40
726	mall	710	-46.5	-24	-36
727	mall	711	-43.5	-24	-36
728	mall	712	-46.5	-24	-32
729	mall	713	-43.5	-24	-32
730	mall	714	-46.5	-24	-28
731	mall	715	-43.5	-24	-28
732	mall	716	-46.5	-24	-24
733	mall	717	-43.5	-24	-24
734	mall	718	-46.5	-24	-20
735	mall	719	-43.5	-24	-20
736	mall	720	-46.5	-24	-16
737	mall	721	-43.5	-24	-16
738	mall	722	-46.5	-24	-12
739	mall	723	-43.5	-24	-12
740	mall	724	-46.5	-24	-8
741	mall	725	-43.5	-24	-8
742	mall	726	-46.5	-24	8
743	mall	727	-43.5	-24	8
744	mall	728	-46.5	-24	12
745	mall	729	-43.5	-24	12
746	mall	730	-46.5	-24	16
747	mall	731	-43.5	-24	16
748	mall	732	-46.5	-24	20
749	mall	733	-43.5	-24	20
750	mall	734	-46.5	-24	24
751	mall	735	-43.5	-24	24
752	mall	736	-46.5	-24	28
753	mall	737	-43.5	-24	28
754	mall	738	-46.5	-24	32
755	mall	739	-43.5	-24	32
756	mall	740	-46.5	-24	36
757	mall	741	-43.5	-24	36
758	mall	742	-46.5	-24	40
759	mall	743	-43.5	-24	40
760	mall	744	-46.5	-24	44
761	mall	745	-43.5	-24	44
762	mall	746	-46.5	-24	48
763	mall	747	-43.5	-24	48
764	mall	748	-36.5	-24	-48
765	mall	749	-33.5	-24	-48
766	mall	750	-36.5	-24	-44
767	mall	751	-33.5	-24	-44
768	mall	752	-36.5	-24	-40
769	mall	753	-33.5	-24	-40
770	mall	754	-36.5	-24	-36
771	mall	755	-33.5	-24	-36
772	mall	756	-36.5	-24	-32
773	mall	757	-33.5	-24	-32
774	mall	758	-36.5	-24	-28
775	mall	759	-33.5	-24	-28
776	mall	760	-36.5	-24	-24
777	mall	761	-33.5	-24	-24
778	mall	762	-36.5	-24	-20
779	mall	763	-33.5	-24	-20
780	mall	764	-36.5	-24	-16
781	mall	765	-33.5	-24	-16
782	mall	766	-36.5	-24	-12
783	mall	767	-33.5	-24	-12
784	mall	768	-36.5	-24	-8
785	mall	769	-33.5	-24	-8
786	mall	770	-36.5	-24	8
787	mall	771	-33.5	-24	8
788	mall	772	-36.5	-24	12
789	mall	773	-33.5	-24	12
790	mall	774	-36.5	-24	16
791	mall	775	-33.5	-24	16
792	mall	776	-36.5	-24	20
793	mall	777	-33.5	-24	20
794	mall	778	-36.5	-24	24
795	mall	779	-33.5	-24	24
796	mall	780	-36.5	-24	28
797	mall	781	-33.5	-24	28
798	mall	782	-36.5	-24	32
799	mall	783	-33.5	-24	32
800	mall	784	-36.5	-24	36
801	mall	785	-33.5	-24	36
802	mall	786	-36.5	-24	40
803	mall	787	-33.5	-24	40
804	mall	788	-36.5	-24	44
805	mall	789	-33.5	-24	44
806	mall	790	-36.5	-24	48
807	mall	791	-33.5	-24	48
808	mall	792	-26.5	-24	-48
809	mall	793	-23.5	-24	-48
810	mall	794	-26.5	-24	-44
811	mall	795	-23.5	-24	-44
812	mall	796	-26.5	-24	-40
813	mall	797	-23.5	-24	-40
814	mall	798	-26.5	-24	-36
815	mall	799	-23.5	-24	-36
816	mall	800	-26.5	-24	-32
817	mall	801	-23.5	-24	-32
818	mall	802	-26.5	-24	-28
819	mall	803	-23.5	-24	-28
820	mall	804	-26.5	-24	-24
821	mall	805	-23.5	-24	-24
822	mall	806	-26.5	-24	-20
823	mall	807	-23.5	-24	-20
824	mall	808	-26.5	-24	-16
825	mall	809	-23.5	-24	-16
826	mall	810	-26.5	-24	-12
827	mall	811	-23.5	-24	-12
828	mall	812	-26.5	-24	-8
829	mall	813	-23.5	-24	-8
830	mall	814	-26.5	-24	8
831	mall	815	-23.5	-24	8
832	mall	816	-26.5	-24	12
833	mall	817	-23.5	-24	12
834	mall	818	-26.5	-24	16
835	mall	819	-23.5	-24	16
836	mall	820	-26.5	-24	20
837	mall	821	-23.5	-24	20
838	mall	822	-26.5	-24	24
839	mall	823	-23.5	-24	24
840	mall	824	-26.5	-24	28
841	mall	825	-23.5	-24	28
842	mall	826	-26.5	-24	32
843	mall	827	-23.5	-24	32
844	mall	828	-26.5	-24	36
845	mall	829	-23.5	-24	36
846	mall	830	-26.5	-24	40
847	mall	831	-23.5	-24	40
848	mall	832	-26.5	-24	44
849	mall	833	-23.5	-24	44
850	mall	834	-26.5	-24	48
851	mall	835	-23.5	-24	48
852	mall	836	-16.5	-24	-48
853	mall	837	-13.5	-24	-48
854	mall	838	-16.5	-24	-44
855	mall	839	-13.5	-24	-44
856	mall	840	-16.5	-24	-40
857	mall	841	-13.5	-24	-40
858	mall	842	-16.5	-24	-36
859	mall	843	-13.5	-24	-36
860	mall	844	-16.5	-24	-32
861	mall	845	-13.5	-24	-32
862	mall	846	-16.5	-24	-28
863	mall	847	-13.5	-24	-28
864	mall	848	-16.5	-24	-24
865	mall	849	-13.5	-24	-24
866	mall	850	-16.5	-24	-20
867	mall	851	-13.5	-24	-20
868	mall	852	-16.5	-24	-16
869	mall	853	-13.5	-24	-16
870	mall	854	-16.5	-24	-12
871	mall	855	-13.5	-24	-12
872	mall	856	-16.5	-24	-8
873	mall	857	-13.5	-24	-8
874	mall	858	-16.5	-24	8
875	mall	859	-13.5	-24	8
876	mall	860	-16.5	-24	12
877	mall	861	-13.5	-24	12
878	mall	862	-16.5	-24	16
879	mall	863	-13.5	-24	16
880	mall	864	-16.5	-24	20
881	mall	865	-13.5	-24	20
882	mall	866	-16.5	-24	24
883	mall	867	-13.5	-24	24
884	mall	868	-16.5	-24	28
885	mall	869	-13.5	-24	28
886	mall	870	-16.5	-24	32
887	mall	871	-13.5	-24	32
888	mall	872	-16.5	-24	36
889	mall	873	-13.5	-24	36
890	mall	874	-16.5	-24	40
891	mall	875	-13.5	-24	40
892	mall	876	-16.5	-24	44
893	mall	877	-13.5	-24	44
894	mall	878	-16.5	-24	48
895	mall	879	-13.5	-24	48
896	mall	880	13.5	-24	-48
897	mall	881	16.5	-24	-48
898	mall	882	13.5	-24	-44
899	mall	883	16.5	-24	-44
900	mall	884	13.5	-24	-40
901	mall	885	16.5	-24	-40
902	mall	886	13.5	-24	-36
903	mall	887	16.5	-24	-36
904	mall	888	13.5	-24	-32
905	mall	889	16.5	-24	-32
906	mall	890	13.5	-24	-28
907	mall	891	16.5	-24	-28
908	mall	892	13.5	-24	-24
909	mall	893	16.5	-24	-24
910	mall	894	13.5	-24	-20
911	mall	895	16.5	-24	-20
912	mall	896	13.5	-24	-16
913	mall	897	16.5	-24	-16
914	mall	898	13.5	-24	-12
915	mall	899	16.5	-24	-12
916	mall	900	13.5	-24	-8
917	mall	901	16.5	-24	-8
918	mall	902	13.5	-24	8
919	mall	903	16.5	-24	8
920	mall	904	13.5	-24	12
921	mall	905	16.5	-24	12
922	mall	906	13.5	-24	16
923	mall	907	16.5	-24	16
924	mall	908	13.5	-24	20
925	mall	909	16.5	-24	20
926	mall	910	13.5	-24	24
927	mall	911	16.5	-24	24
928	mall	912	13.5	-24	28
929	mall	913	16.5	-24	28
930	mall	914	13.5	-24	32
931	mall	915	16.5	-24	32
932	mall	916	13.5	-24	36
933	mall	917	16.5	-24	36
934	mall	918	13.5	-24	40
935	mall	919	16.5	-24	40
936	mall	920	13.5	-24	44
937	mall	921	16.5	-24	44
938	mall	922	13.5	-24	48
939	mall	923	16.5	-24	48
940	mall	924	23.5	-24	-48
941	mall	925	26.5	-24	-48
942	mall	926	23.5	-24	-44
943	mall	927	26.5	-24	-44
944	mall	928	23.5	-24	-40
945	mall	929	26.5	-24	-40
946	mall	930	23.5	-24	-36
947	mall	931	26.5	-24	-36
948	mall	932	23.5	-24	-32
949	mall	933	26.5	-24	-32
950	mall	934	23.5	-24	-28
951	mall	935	26.5	-24	-28
952	mall	936	23.5	-24	-24
953	mall	937	26.5	-24	-24
954	mall	938	23.5	-24	-20
955	mall	939	26.5	-24	-20
956	mall	940	23.5	-24	-16
957	mall	941	26.5	-24	-16
958	mall	942	23.5	-24	-12
959	mall	943	26.5	-24	-12
960	mall	944	23.5	-24	-8
961	mall	945	26.5	-24	-8
962	mall	946	23.5	-24	8
963	mall	947	26.5	-24	8
964	mall	948	23.5	-24	12
965	mall	949	26.5	-24	12
966	mall	950	23.5	-24	16
967	mall	951	26.5	-24	16
968	mall	952	23.5	-24	20
969	mall	953	26.5	-24	20
970	mall	954	23.5	-24	24
971	mall	955	26.5	-24	24
972	mall	956	23.5	-24	28
973	mall	957	26.5	-24	28
974	mall	958	23.5	-24	32
975	mall	959	26.5	-24	32
976	mall	960	23.5	-24	36
977	mall	961	26.5	-24	36
978	mall	962	23.5	-24	40
979	mall	963	26.5	-24	40
980	mall	964	23.5	-24	44
981	mall	965	26.5	-24	44
982	mall	966	23.5	-24	48
983	mall	967	26.5	-24	48
984	mall	968	33.5	-24	-48
985	mall	969	36.5	-24	-48
986	mall	970	33.5	-24	-44
987	mall	971	36.5	-24	-44
988	mall	972	33.5	-24	-40
989	mall	973	36.5	-24	-40
990	mall	974	33.5	-24	-36
991	mall	975	36.5	-24	-36
992	mall	976	33.5	-24	-32
993	mall	977	36.5	-24	-32
994	mall	978	33.5	-24	-28
995	mall	979	36.5	-24	-28
996	mall	980	33.5	-24	-24
997	mall	981	36.5	-24	-24
998	mall	982	33.5	-24	-20
999	mall	983	36.5	-24	-20
1000	mall	984	33.5	-24	-16
1001	mall	985	36.5	-24	-16
1002	mall	986	33.5	-24	-12
1003	mall	987	36.5	-24	-12
1004	mall	988	33.5	-24	-8
1005	mall	989	36.5	-24	-8
1006	mall	990	33.5	-24	8
1007	mall	991	36.5	-24	8
1008	mall	992	33.5	-24	12
1009	mall	993	36.5	-24	12
1010	mall	994	33.5	-24	16
1011	mall	995	36.5	-24	16
1012	mall	996	33.5	-24	20
1013	mall	997	36.5	-24	20
1014	mall	998	33.5	-24	24
1015	mall	999	36.5	-24	24
1016	mall	1000	33.5	-24	28
1017	mall	1001	36.5	-24	28
1018	mall	1002	33.5	-24	32
1019	mall	1003	36.5	-24	32
1020	mall	1004	33.5	-24	36
1021	mall	1005	36.5	-24	36
1022	mall	1006	33.5	-24	40
1023	mall	1007	36.5	-24	40
1024	mall	1008	33.5	-24	44
1025	mall	1009	36.5	-24	44
1026	mall	1010	33.5	-24	48
1027	mall	1011	36.5	-24	48
1028	mall	1012	43.5	-24	-48
1029	mall	1013	46.5	-24	-48
1030	mall	1014	43.5	-24	-44
1031	mall	1015	46.5	-24	-44
1032	mall	1016	43.5	-24	-40
1033	mall	1017	46.5	-24	-40
1034	mall	1018	43.5	-24	-36
1035	mall	1019	46.5	-24	-36
1036	mall	1020	43.5	-24	-32
1037	mall	1021	46.5	-24	-32
1038	mall	1022	43.5	-24	-28
1039	mall	1023	46.5	-24	-28
1040	mall	1024	43.5	-24	-24
1041	mall	1025	46.5	-24	-24
1042	mall	1026	43.5	-24	-20
1043	mall	1027	46.5	-24	-20
1044	mall	1028	43.5	-24	-16
1045	mall	1029	46.5	-24	-16
1046	mall	1030	43.5	-24	-12
1047	mall	1031	46.5	-24	-12
1048	mall	1032	43.5	-24	-8
1049	mall	1033	46.5	-24	-8
1050	mall	1034	43.5	-24	8
1051	mall	1035	46.5	-24	8
1052	mall	1036	43.5	-24	12
1053	mall	1037	46.5	-24	12
1054	mall	1038	43.5	-24	16
1055	mall	1039	46.5	-24	16
1056	mall	1040	43.5	-24	20
1057	mall	1041	46.5	-24	20
1058	mall	1042	43.5	-24	24
1059	mall	1043	46.5	-24	24
1060	mall	1044	43.5	-24	28
1061	mall	1045	46.5	-24	28
1062	mall	1046	43.5	-24	32
1063	mall	1047	46.5	-24	32
1064	mall	1048	43.5	-24	36
1065	mall	1049	46.5	-24	36
1066	mall	1050	43.5	-24	40
1067	mall	1051	46.5	-24	40
1068	mall	1052	43.5	-24	44
1069	mall	1053	46.5	-24	44
1070	mall	1054	43.5	-24	48
1071	mall	1055	46.5	-24	48
1072	mall	1056	-46.5	-30	-48
1073	mall	1057	-43.5	-30	-48
1074	mall	1058	-46.5	-30	-44
1075	mall	1059	-43.5	-30	-44
1076	mall	1060	-46.5	-30	-40
1077	mall	1061	-43.5	-30	-40
1078	mall	1062	-46.5	-30	-36
1079	mall	1063	-43.5	-30	-36
1080	mall	1064	-46.5	-30	-32
1081	mall	1065	-43.5	-30	-32
1082	mall	1066	-46.5	-30	-28
1083	mall	1067	-43.5	-30	-28
1084	mall	1068	-46.5	-30	-24
1085	mall	1069	-43.5	-30	-24
1086	mall	1070	-46.5	-30	-20
1087	mall	1071	-43.5	-30	-20
1088	mall	1072	-46.5	-30	-16
1089	mall	1073	-43.5	-30	-16
1090	mall	1074	-46.5	-30	-12
1091	mall	1075	-43.5	-30	-12
1092	mall	1076	-46.5	-30	-8
1093	mall	1077	-43.5	-30	-8
1094	mall	1078	-46.5	-30	8
1095	mall	1079	-43.5	-30	8
1096	mall	1080	-46.5	-30	12
1097	mall	1081	-43.5	-30	12
1098	mall	1082	-46.5	-30	16
1099	mall	1083	-43.5	-30	16
1100	mall	1084	-46.5	-30	20
1101	mall	1085	-43.5	-30	20
1102	mall	1086	-46.5	-30	24
1103	mall	1087	-43.5	-30	24
1104	mall	1088	-46.5	-30	28
1105	mall	1089	-43.5	-30	28
1106	mall	1090	-46.5	-30	32
1107	mall	1091	-43.5	-30	32
1108	mall	1092	-46.5	-30	36
1109	mall	1093	-43.5	-30	36
1110	mall	1094	-46.5	-30	40
1111	mall	1095	-43.5	-30	40
1112	mall	1096	-46.5	-30	44
1113	mall	1097	-43.5	-30	44
1114	mall	1098	-46.5	-30	48
1115	mall	1099	-43.5	-30	48
1116	mall	1100	-36.5	-30	-48
1117	mall	1101	-33.5	-30	-48
1118	mall	1102	-36.5	-30	-44
1119	mall	1103	-33.5	-30	-44
1120	mall	1104	-36.5	-30	-40
1121	mall	1105	-33.5	-30	-40
1122	mall	1106	-36.5	-30	-36
1123	mall	1107	-33.5	-30	-36
1124	mall	1108	-36.5	-30	-32
1125	mall	1109	-33.5	-30	-32
1126	mall	1110	-36.5	-30	-28
1127	mall	1111	-33.5	-30	-28
1128	mall	1112	-36.5	-30	-24
1129	mall	1113	-33.5	-30	-24
1130	mall	1114	-36.5	-30	-20
1131	mall	1115	-33.5	-30	-20
1132	mall	1116	-36.5	-30	-16
1133	mall	1117	-33.5	-30	-16
1134	mall	1118	-36.5	-30	-12
1135	mall	1119	-33.5	-30	-12
1136	mall	1120	-36.5	-30	-8
1137	mall	1121	-33.5	-30	-8
1138	mall	1122	-36.5	-30	8
1139	mall	1123	-33.5	-30	8
1140	mall	1124	-36.5	-30	12
1141	mall	1125	-33.5	-30	12
1142	mall	1126	-36.5	-30	16
1143	mall	1127	-33.5	-30	16
1144	mall	1128	-36.5	-30	20
1145	mall	1129	-33.5	-30	20
1146	mall	1130	-36.5	-30	24
1147	mall	1131	-33.5	-30	24
1148	mall	1132	-36.5	-30	28
1149	mall	1133	-33.5	-30	28
1150	mall	1134	-36.5	-30	32
1151	mall	1135	-33.5	-30	32
1152	mall	1136	-36.5	-30	36
1153	mall	1137	-33.5	-30	36
1154	mall	1138	-36.5	-30	40
1155	mall	1139	-33.5	-30	40
1156	mall	1140	-36.5	-30	44
1157	mall	1141	-33.5	-30	44
1158	mall	1142	-36.5	-30	48
1159	mall	1143	-33.5	-30	48
1160	mall	1144	-26.5	-30	-48
1161	mall	1145	-23.5	-30	-48
1162	mall	1146	-26.5	-30	-44
1163	mall	1147	-23.5	-30	-44
1164	mall	1148	-26.5	-30	-40
1165	mall	1149	-23.5	-30	-40
1166	mall	1150	-26.5	-30	-36
1167	mall	1151	-23.5	-30	-36
1168	mall	1152	-26.5	-30	-32
1169	mall	1153	-23.5	-30	-32
1170	mall	1154	-26.5	-30	-28
1171	mall	1155	-23.5	-30	-28
1172	mall	1156	-26.5	-30	-24
1173	mall	1157	-23.5	-30	-24
1174	mall	1158	-26.5	-30	-20
1175	mall	1159	-23.5	-30	-20
1176	mall	1160	-26.5	-30	-16
1177	mall	1161	-23.5	-30	-16
1178	mall	1162	-26.5	-30	-12
1179	mall	1163	-23.5	-30	-12
1180	mall	1164	-26.5	-30	-8
1181	mall	1165	-23.5	-30	-8
1182	mall	1166	-26.5	-30	8
1183	mall	1167	-23.5	-30	8
1184	mall	1168	-26.5	-30	12
1185	mall	1169	-23.5	-30	12
1186	mall	1170	-26.5	-30	16
1187	mall	1171	-23.5	-30	16
1188	mall	1172	-26.5	-30	20
1189	mall	1173	-23.5	-30	20
1190	mall	1174	-26.5	-30	24
1191	mall	1175	-23.5	-30	24
1192	mall	1176	-26.5	-30	28
1193	mall	1177	-23.5	-30	28
1194	mall	1178	-26.5	-30	32
1195	mall	1179	-23.5	-30	32
1196	mall	1180	-26.5	-30	36
1197	mall	1181	-23.5	-30	36
1198	mall	1182	-26.5	-30	40
1199	mall	1183	-23.5	-30	40
1200	mall	1184	-26.5	-30	44
1201	mall	1185	-23.5	-30	44
1202	mall	1186	-26.5	-30	48
1203	mall	1187	-23.5	-30	48
1204	mall	1188	-16.5	-30	-48
1205	mall	1189	-13.5	-30	-48
1206	mall	1190	-16.5	-30	-44
1207	mall	1191	-13.5	-30	-44
1208	mall	1192	-16.5	-30	-40
1209	mall	1193	-13.5	-30	-40
1210	mall	1194	-16.5	-30	-36
1211	mall	1195	-13.5	-30	-36
1212	mall	1196	-16.5	-30	-32
1213	mall	1197	-13.5	-30	-32
1214	mall	1198	-16.5	-30	-28
1215	mall	1199	-13.5	-30	-28
1216	mall	1200	-16.5	-30	-24
1217	mall	1201	-13.5	-30	-24
1218	mall	1202	-16.5	-30	-20
1219	mall	1203	-13.5	-30	-20
1220	mall	1204	-16.5	-30	-16
1221	mall	1205	-13.5	-30	-16
1222	mall	1206	-16.5	-30	-12
1223	mall	1207	-13.5	-30	-12
1224	mall	1208	-16.5	-30	-8
1225	mall	1209	-13.5	-30	-8
1226	mall	1210	-16.5	-30	8
1227	mall	1211	-13.5	-30	8
1228	mall	1212	-16.5	-30	12
1229	mall	1213	-13.5	-30	12
1230	mall	1214	-16.5	-30	16
1231	mall	1215	-13.5	-30	16
1232	mall	1216	-16.5	-30	20
1233	mall	1217	-13.5	-30	20
1234	mall	1218	-16.5	-30	24
1235	mall	1219	-13.5	-30	24
1236	mall	1220	-16.5	-30	28
1237	mall	1221	-13.5	-30	28
1238	mall	1222	-16.5	-30	32
1239	mall	1223	-13.5	-30	32
1240	mall	1224	-16.5	-30	36
1241	mall	1225	-13.5	-30	36
1242	mall	1226	-16.5	-30	40
1243	mall	1227	-13.5	-30	40
1244	mall	1228	-16.5	-30	44
1245	mall	1229	-13.5	-30	44
1246	mall	1230	-16.5	-30	48
1247	mall	1231	-13.5	-30	48
1248	mall	1232	13.5	-30	-48
1249	mall	1233	16.5	-30	-48
1250	mall	1234	13.5	-30	-44
1251	mall	1235	16.5	-30	-44
1252	mall	1236	13.5	-30	-40
1253	mall	1237	16.5	-30	-40
1254	mall	1238	13.5	-30	-36
1255	mall	1239	16.5	-30	-36
1256	mall	1240	13.5	-30	-32
1257	mall	1241	16.5	-30	-32
1258	mall	1242	13.5	-30	-28
1259	mall	1243	16.5	-30	-28
1260	mall	1244	13.5	-30	-24
1261	mall	1245	16.5	-30	-24
1262	mall	1246	13.5	-30	-20
1263	mall	1247	16.5	-30	-20
1264	mall	1248	13.5	-30	-16
1265	mall	1249	16.5	-30	-16
1266	mall	1250	13.5	-30	-12
1267	mall	1251	16.5	-30	-12
1268	mall	1252	13.5	-30	-8
1269	mall	1253	16.5	-30	-8
1270	mall	1254	13.5	-30	8
1271	mall	1255	16.5	-30	8
1272	mall	1256	13.5	-30	12
1273	mall	1257	16.5	-30	12
1274	mall	1258	13.5	-30	16
1275	mall	1259	16.5	-30	16
1276	mall	1260	13.5	-30	20
1277	mall	1261	16.5	-30	20
1278	mall	1262	13.5	-30	24
1279	mall	1263	16.5	-30	24
1280	mall	1264	13.5	-30	28
1281	mall	1265	16.5	-30	28
1282	mall	1266	13.5	-30	32
1283	mall	1267	16.5	-30	32
1284	mall	1268	13.5	-30	36
1285	mall	1269	16.5	-30	36
1286	mall	1270	13.5	-30	40
1287	mall	1271	16.5	-30	40
1288	mall	1272	13.5	-30	44
1289	mall	1273	16.5	-30	44
1290	mall	1274	13.5	-30	48
1291	mall	1275	16.5	-30	48
1292	mall	1276	23.5	-30	-48
1293	mall	1277	26.5	-30	-48
1294	mall	1278	23.5	-30	-44
1295	mall	1279	26.5	-30	-44
1296	mall	1280	23.5	-30	-40
1297	mall	1281	26.5	-30	-40
1298	mall	1282	23.5	-30	-36
1299	mall	1283	26.5	-30	-36
1300	mall	1284	23.5	-30	-32
1301	mall	1285	26.5	-30	-32
1302	mall	1286	23.5	-30	-28
1303	mall	1287	26.5	-30	-28
1304	mall	1288	23.5	-30	-24
1305	mall	1289	26.5	-30	-24
1306	mall	1290	23.5	-30	-20
1307	mall	1291	26.5	-30	-20
1308	mall	1292	23.5	-30	-16
1309	mall	1293	26.5	-30	-16
1310	mall	1294	23.5	-30	-12
1311	mall	1295	26.5	-30	-12
1312	mall	1296	23.5	-30	-8
1313	mall	1297	26.5	-30	-8
1314	mall	1298	23.5	-30	8
1315	mall	1299	26.5	-30	8
1316	mall	1300	23.5	-30	12
1317	mall	1301	26.5	-30	12
1318	mall	1302	23.5	-30	16
1319	mall	1303	26.5	-30	16
1320	mall	1304	23.5	-30	20
1321	mall	1305	26.5	-30	20
1322	mall	1306	23.5	-30	24
1323	mall	1307	26.5	-30	24
1324	mall	1308	23.5	-30	28
1325	mall	1309	26.5	-30	28
1326	mall	1310	23.5	-30	32
1327	mall	1311	26.5	-30	32
1328	mall	1312	23.5	-30	36
1329	mall	1313	26.5	-30	36
1330	mall	1314	23.5	-30	40
1331	mall	1315	26.5	-30	40
1332	mall	1316	23.5	-30	44
1333	mall	1317	26.5	-30	44
1334	mall	1318	23.5	-30	48
1335	mall	1319	26.5	-30	48
1336	mall	1320	33.5	-30	-48
1337	mall	1321	36.5	-30	-48
1338	mall	1322	33.5	-30	-44
1339	mall	1323	36.5	-30	-44
1340	mall	1324	33.5	-30	-40
1341	mall	1325	36.5	-30	-40
1342	mall	1326	33.5	-30	-36
1343	mall	1327	36.5	-30	-36
1344	mall	1328	33.5	-30	-32
1345	mall	1329	36.5	-30	-32
1346	mall	1330	33.5	-30	-28
1347	mall	1331	36.5	-30	-28
1348	mall	1332	33.5	-30	-24
1349	mall	1333	36.5	-30	-24
1350	mall	1334	33.5	-30	-20
1351	mall	1335	36.5	-30	-20
1352	mall	1336	33.5	-30	-16
1353	mall	1337	36.5	-30	-16
1354	mall	1338	33.5	-30	-12
1355	mall	1339	36.5	-30	-12
1356	mall	1340	33.5	-30	-8
1357	mall	1341	36.5	-30	-8
1358	mall	1342	33.5	-30	8
1359	mall	1343	36.5	-30	8
1360	mall	1344	33.5	-30	12
1361	mall	1345	36.5	-30	12
1362	mall	1346	33.5	-30	16
1363	mall	1347	36.5	-30	16
1364	mall	1348	33.5	-30	20
1365	mall	1349	36.5	-30	20
1366	mall	1350	33.5	-30	24
1367	mall	1351	36.5	-30	24
1368	mall	1352	33.5	-30	28
1369	mall	1353	36.5	-30	28
1370	mall	1354	33.5	-30	32
1371	mall	1355	36.5	-30	32
1372	mall	1356	33.5	-30	36
1373	mall	1357	36.5	-30	36
1374	mall	1358	33.5	-30	40
1375	mall	1359	36.5	-30	40
1376	mall	1360	33.5	-30	44
1377	mall	1361	36.5	-30	44
1378	mall	1362	33.5	-30	48
1379	mall	1363	36.5	-30	48
1380	mall	1364	43.5	-30	-48
1381	mall	1365	46.5	-30	-48
1382	mall	1366	43.5	-30	-44
1383	mall	1367	46.5	-30	-44
1384	mall	1368	43.5	-30	-40
1385	mall	1369	46.5	-30	-40
1386	mall	1370	43.5	-30	-36
1387	mall	1371	46.5	-30	-36
1388	mall	1372	43.5	-30	-32
1389	mall	1373	46.5	-30	-32
1390	mall	1374	43.5	-30	-28
1391	mall	1375	46.5	-30	-28
1392	mall	1376	43.5	-30	-24
1393	mall	1377	46.5	-30	-24
1394	mall	1378	43.5	-30	-20
1395	mall	1379	46.5	-30	-20
1396	mall	1380	43.5	-30	-16
1397	mall	1381	46.5	-30	-16
1398	mall	1382	43.5	-30	-12
1399	mall	1383	46.5	-30	-12
1400	mall	1384	43.5	-30	-8
1401	mall	1385	46.5	-30	-8
1402	mall	1386	43.5	-30	8
1403	mall	1387	46.5	-30	8
1404	mall	1388	43.5	-30	12
1405	mall	1389	46.5	-30	12
1406	mall	1390	43.5	-30	16
1407	mall	1391	46.5	-30	16
1408	mall	1392	43.5	-30	20
1409	mall	1393	46.5	-30	20
1410	mall	1394	43.5	-30	24
1411	mall	1395	46.5	-30	24
1412	mall	1396	43.5	-30	28
1413	mall	1397	46.5	-30	28
1414	mall	1398	43.5	-30	32
1415	mall	1399	46.5	-30	32
1416	mall	1400	43.5	-30	36
1417	mall	1401	46.5	-30	36
1418	mall	1402	43.5	-30	40
1419	mall	1403	46.5	-30	40
1420	mall	1404	43.5	-30	44
1421	mall	1405	46.5	-30	44
1422	mall	1406	43.5	-30	48
1423	mall	1407	46.5	-30	48
\.


--
-- Data for Name: pricing_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_policies (id, policy_name, free_minutes, base_rate, unit_minutes, max_daily_fee, re_entry_limit, capacity, is_active) FROM stdin;
1	Default	30	1000	60	20000	\N	5	t
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, event_id, fee_calculated, discount_applied, fee_paid, payment_method, transaction_time, is_paid) FROM stdin;
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (id, plate_number, is_vip, registered_until, memo) FROM stdin;
1	12가3456	f	\N	\N
2	35가8968	f	\N	\N
3	82가9451	f	\N	\N
4	77가6698	f	\N	\N
5	10가5689	f	\N	\N
\.


--
-- Name: gates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gates_id_seq', 6, true);


--
-- Name: map_configs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.map_configs_id_seq', 3, true);


--
-- Name: parking_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parking_events_id_seq', 5, true);


--
-- Name: parking_spots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.parking_spots_id_seq', 1423, true);


--
-- Name: pricing_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pricing_policies_id_seq', 1, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, false);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 5, true);


--
-- Name: gates gates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gates
    ADD CONSTRAINT gates_pkey PRIMARY KEY (id);


--
-- Name: map_configs map_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.map_configs
    ADD CONSTRAINT map_configs_pkey PRIMARY KEY (id);


--
-- Name: parking_events parking_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_events
    ADD CONSTRAINT parking_events_pkey PRIMARY KEY (id);


--
-- Name: parking_spots parking_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_spots
    ADD CONSTRAINT parking_spots_pkey PRIMARY KEY (id);


--
-- Name: pricing_policies pricing_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_policies
    ADD CONSTRAINT pricing_policies_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: ix_gates_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_gates_id ON public.gates USING btree (id);


--
-- Name: ix_map_configs_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_map_configs_id ON public.map_configs USING btree (id);


--
-- Name: ix_map_configs_map_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_map_configs_map_id ON public.map_configs USING btree (map_id);


--
-- Name: ix_parking_events_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_parking_events_id ON public.parking_events USING btree (id);


--
-- Name: ix_parking_spots_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_parking_spots_id ON public.parking_spots USING btree (id);


--
-- Name: ix_pricing_policies_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_pricing_policies_id ON public.pricing_policies USING btree (id);


--
-- Name: ix_transactions_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_transactions_id ON public.transactions USING btree (id);


--
-- Name: ix_vehicles_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_vehicles_id ON public.vehicles USING btree (id);


--
-- Name: ix_vehicles_plate_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_vehicles_plate_number ON public.vehicles USING btree (plate_number);


--
-- Name: gates gates_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gates
    ADD CONSTRAINT gates_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.map_configs(map_id);


--
-- Name: parking_events parking_events_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_events
    ADD CONSTRAINT parking_events_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: parking_spots parking_spots_map_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parking_spots
    ADD CONSTRAINT parking_spots_map_id_fkey FOREIGN KEY (map_id) REFERENCES public.map_configs(map_id);


--
-- Name: transactions transactions_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.parking_events(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 6un77KUihWDnWv8rrLlk2G9SuXVr505V9LgXgGykjlRBpMQQTlMDkRmMdiI8D2H

