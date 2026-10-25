import base64
from pathlib import Path
from typing import List
from schemas import (
    EvidenceItem,
    DirectObservation,
    Claim,
    Contradiction,
    TimelineEvent,
    UnresolvedQuestion,
    InvestigationTask,
    EvidenceAnalysisResult,
    InvestigationReport
)

BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "assets"

def get_cctv_base64() -> str:
    cctv_path = ASSETS_DIR / "cctv_frame_2218.jpg"
    if cctv_path.exists():
        with open(cctv_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    return ""

def get_demo_evidence_items() -> List[EvidenceItem]:
    cctv_b64 = get_cctv_base64()
    
    return [
        EvidenceItem(
            id="EVD-001",
            title="Physical Security Incident & Alarm Dispatch Log",
            source_name="Site Security Command Desk (Officer T. Daniels)",
            evidence_type="text",
            timestamp_raw="2026-10-24 22:42:00 UTC",
            description="Initial incident log following acoustic vibration alarm trigger at Server Room B access threshold.",
            tags=["Physical Security", "Alarm Event", "First Responder"],
            content_text="""INCIDENT REPORT: REF #IR-2026-1024-88
DATE/TIME: 2026-10-24 22:42:00 UTC
REPORTING OFFICER: T. Daniels (Badge #SEC-412)
LOCATION: Sector 2, North Corridor, Server Room B Threshold

SUMMARY OF OBSERVATIONS:
At 22:42:15 UTC, central console annunciated an acoustic frequency trip (Sensor 4A - Acoustic Threshold) located at Server Room B. Responding on foot, arrived on scene at 22:45:00 UTC. 

Key physical findings:
1. Secondary electromagnetic latch was found disengaged; high-security vault door was resting ajar by approximately 4 inches.
2. No exterior perimeter breaches or shattered glass noted on building envelope.
3. Mechanical pin tumbler auxiliary lock barrel exhibited micro-scratching around the keyway, consistent with rapid pick gun manipulation or improper mechanical override tool insertion.
4. Server rack cabinet 04 (housing core encrypted database cold-storage arrays) was unlatched with dual thumb screws completely unscrewed."""
        ),
        EvidenceItem(
            id="EVD-002",
            title="CCTV Surveillance Video Frame (Cam-04)",
            source_name="CCTV Cam-04 (NW Corridor Server Room B Approach)",
            evidence_type="image",
            timestamp_raw="2026-10-24 22:18:14 UTC",
            image_base64=cctv_b64,
            image_mime_type="image/jpeg",
            description="High-definition surveillance capture showing an unidentified subject approaching Server Room B carrying specialized containment luggage.",
            tags=["Visual Evidence", "Surveillance", "Subject Identification"],
            content_text="Surveillance still from Cam-04 at 22:18:14 UTC: Depicts an adult subject in high-visibility fluorescent yellow technician vest with reflective tape, dark cargo pants, and cap. Subject is carrying a black hard-shell Pelican 1510 storm case with right hand, walking directly toward the Server Room B portal."
        ),
        EvidenceItem(
            id="EVD-003",
            title="Electronic Keycard & Reader 202-B Audit Log",
            source_name="Lenel OnGuard Access Control System (Reader ID: 202-B)",
            evidence_type="csv",
            timestamp_raw="2026-10-24 20:00:00 to 22:50:00 UTC",
            description="Machine-exported transaction records for Server Room B primary ingress/egress terminal.",
            tags=["Access Control", "Audit Trail", "Cryptographic Log"],
            content_text="""Timestamp,Reader_ID,Badge_Number,Cardholder_Name,Event_Type,Authorization_Level,Clearance_Status
2026-10-24 20:14:02 UTC,202-B,B-8812,Alice Vance (Lead SysAdmin),ENTRY_GRANTED,Level 4,VERIFIED_NORMAL
2026-10-24 20:45:11 UTC,202-B,B-8812,Alice Vance (Lead SysAdmin),EXIT_RECORDED,Level 4,VERIFIED_NORMAL
2026-10-24 22:15:30 UTC,202-B,B-4091,Marcus Reed (HVAC Contractor),ACCESS_DENIED,Level 2,DENIED_EXPIRED_CERT
2026-10-24 22:28:44 UTC,202-B,B-9999,MASTER_OVERRIDE_KEY,ACCESS_GRANTED,Emergency,MANUAL_BYPASS_ENGAGED
2026-10-24 22:39:10 UTC,202-B,B-9999,MASTER_OVERRIDE_KEY,EXIT_RECORDED,Emergency,MANUAL_BYPASS_ENGAGED"""
        ),
        EvidenceItem(
            id="EVD-004",
            title="Witness Interview Transcript: Dr. Evelyn Chen",
            source_name="Lead Data Scientist Dr. Evelyn Chen (Interviewed by Security Lead)",
            evidence_type="text",
            timestamp_raw="2026-10-24 22:25:00 UTC (Event Observation)",
            description="Direct eyewitness statement from facility employee present on the 4th floor corridor near Stairwell B during the critical timeframe.",
            tags=["Witness Testimony", "Human Intelligence", "Corroboration"],
            content_text="""WITNESS STATEMENT
WITNESS: Dr. Evelyn Chen, Lead AI Researcher
INTERVIEW CONDUCTED: 2026-10-25 08:30:00 UTC

STATEMENT:
"I was working late on server evaluations for the quarterly release. At approximately 22:25 UTC, I stepped out of Lab 402 to get tea at the breakroom near Stairwell B. 

I distinctly saw an individual descending Stairwell B briskly from the direction of the 2nd floor server mezzanine. He was wearing an oversized fluorescent safety vest, dark work trousers, and was holding a heavy black Pelican case that appeared weighted down. 

I said 'Working late too?' and he immediately pulled his cap downward, did not speak a word, and hurried down toward the ground floor loading bay exit. I noticed he had an orange visitor vendor lanyard clipped onto his utility belt." """
        ),
        EvidenceItem(
            id="EVD-005",
            title="IT Director Status Broadcast Email",
            source_name="Vikram Malhotra (Director of Enterprise Infrastructure)",
            evidence_type="text",
            timestamp_raw="2026-10-25 06:15:00 UTC",
            description="Internal corporate management communication claiming facility security was unbreached and attributing alerts to HVAC automation.",
            tags=["Internal Memo", "Contradictory Claim", "Executive Communication"],
            content_text="""FROM: Vikram Malhotra <v.malhotra@apexcorp.internal>
TO: Executive Security Committee
DATE: 2026-10-25 06:15:00 UTC
SUBJECT: RE: Automated Security Ping - Server Room B

Executive Team,
Please disregard automated alerts originating from Server Room B overnight. Facilities engineering confirmed that an automated HVAC thermal sensor experienced an intermittent fan relay trip at 23:00 UTC, triggering a minor sensor alert.

To reassure everyone: Server Room B was completely secured and locked under active surveillance for the entire evening. Our electronic badge logs confirm zero badge scans or ingress occurred after normal operational hours ceased at 20:00 UTC. No unauthorized personnel were present, and no physical hardware, storage media, or drives were accessed or removed. 

No further investigation is required and normal laboratory operations may resume."""
        ),
    ]

def get_deterministic_analysis_result() -> EvidenceAnalysisResult:
    return EvidenceAnalysisResult(
        case_name="Operation Apex Glass - Corporate Server Facility Breach",
        analyzed_at="2026-10-25T07:15:00Z",
        model_used="gemma-4-26b-a4b-it (Deterministic Grounded Fixture)",
        is_fixture_data=True,
        evidence_count=5,
        direct_observations=[
            DirectObservation(
                evidence_id="EVD-001",
                observation="Officer Daniels documented secondary magnetic lock disengaged, door ajar by 4 inches, and physical lock cylinder showing micro-scratches.",
                modality="textual",
                verifiable=True
            ),
            DirectObservation(
                evidence_id="EVD-001",
                observation="Server rack cabinet 04 thumb screws were found completely unscrewed.",
                modality="textual",
                verifiable=True
            ),
            DirectObservation(
                evidence_id="EVD-002",
                observation="CCTV Cam-04 recorded an individual wearing a fluorescent high-visibility vest and cap carrying a black Pelican 1510 storm case toward Server Room B at 22:18:14 UTC.",
                modality="visual",
                verifiable=True
            ),
            DirectObservation(
                evidence_id="EVD-003",
                observation="Access Control Reader 202-B logged badge B-4091 (Marcus Reed) denied at 22:15:30 UTC, followed by Emergency Master Override Key (B-9999) granted at 22:28:44 UTC and exited at 22:39:10 UTC.",
                modality="tabular",
                verifiable=True
            ),
            DirectObservation(
                evidence_id="EVD-004",
                observation="Dr. Evelyn Chen observed a man in high-visibility vest carrying a weighted black Pelican case exiting Stairwell B toward loading bay at 22:25 UTC.",
                modality="textual",
                verifiable=True
            ),
            DirectObservation(
                evidence_id="EVD-005",
                observation="IT Director Vikram Malhotra asserted that zero badge swipes occurred after 20:00 UTC and that an HVAC thermal sensor at 23:00 UTC caused the only alert.",
                modality="textual",
                verifiable=True
            ),
        ],
        claims=[
            Claim(
                id="CLM-01",
                statement="Electronic badge swipes occurred at Server Room B after 20:00 UTC.",
                evidence_id="EVD-003",
                source_name="Lenel OnGuard Access System",
                claim_type="supported",
                confidence=1.0,
                rationale="Audit log records Alice Vance at 20:14/20:45, Marcus Reed at 22:15:30, and Emergency Override at 22:28:44 and 22:39:10 UTC."
            ),
            Claim(
                id="CLM-02",
                statement="Zero badge swipes or ingress occurred after 20:00 UTC and Server Room B remained locked all evening.",
                evidence_id="EVD-005",
                source_name="Vikram Malhotra (IT Director)",
                claim_type="contradicted",
                confidence=0.99,
                rationale="Directly refuted by Lenel Reader 202-B log showing multiple post-20:00 card/override transactions, plus Officer Daniels observing door standing ajar."
            ),
            Claim(
                id="CLM-03",
                statement="The security alert was triggered by an HVAC thermal sensor at 23:00 UTC.",
                evidence_id="EVD-005",
                source_name="Vikram Malhotra (IT Director)",
                claim_type="contradicted",
                confidence=0.98,
                rationale="Officer Daniels incident report establishes acoustic sensor 4A tripped at 22:42:15 UTC, with officer dispatch on scene by 22:45:00 UTC."
            ),
            Claim(
                id="CLM-04",
                statement="An unidentified individual accessed Server Room B and removed hardware using a Pelican case.",
                evidence_id="EVD-002",
                source_name="CCTV Cam-04 & Dr. Chen Statement",
                claim_type="supported",
                confidence=0.91,
                rationale="CCTV shows subject with Pelican case approaching at 22:18 UTC; Dr. Chen observed subject exiting stairwell with weighted Pelican case at 22:25 UTC; Rack 04 thumb screws unscrewed."
            ),
            Claim(
                id="CLM-05",
                statement="No servers or hardware were tampered with or removed.",
                evidence_id="EVD-005",
                source_name="Vikram Malhotra (IT Director)",
                claim_type="contradicted",
                confidence=0.94,
                rationale="Physical inspection confirmed Server Rack 04 cold-storage array was unlatched with fasteners removed during the unauthorized ingress window."
            ),
            Claim(
                id="CLM-06",
                statement="Master Override Key B-9999 was authorized and checked out legitimately.",
                evidence_id="EVD-003",
                source_name="System Key Vault",
                claim_type="unverified",
                confidence=0.45,
                rationale="While Reader 202-B records B-9999 bypass, no physical key checkout log or emergency authorization ticket has been produced."
            )
        ],
        contradictions=[
            Contradiction(
                id="CON-01",
                claim_a="Electronic badge logs confirm zero badge scans or ingress occurred after normal operational hours ceased at 20:00 UTC (EVD-005).",
                claim_b="Reader 202-B logged card swipe attempts at 22:15:30 UTC (B-4091 Marcus Reed) and Master Override Key access at 22:28:44 UTC and 22:39:10 UTC (EVD-003).",
                evidence_a_id="EVD-005",
                evidence_b_id="EVD-003",
                source_a="IT Director Vikram Malhotra Memo",
                source_b="Lenel OnGuard Access Control Log",
                conflict_summary="The IT Director's assertion of zero activity after 20:00 is directly irreconcilable with authenticated electronic reader logs recording multiple events between 20:14 and 22:39 UTC.",
                is_genuine_contradiction=True,
                severity="critical",
                suggested_reconciliation="Audit IT Director's access to Lenel console and preserve raw database logs to determine whether EVD-005 was an intentional obfuscation or erroneous summary."
            ),
            Contradiction(
                id="CON-02",
                claim_a="The alarm was caused by an automated HVAC thermal sensor intermittent trip at 23:00 UTC (EVD-005).",
                claim_b="Security dispatch logged an acoustic sensor 4A trip at 22:42:15 UTC, with physical breach of secondary magnetic lock (EVD-001).",
                evidence_a_id="EVD-005",
                evidence_b_id="EVD-001",
                source_a="IT Director Vikram Malhotra Memo",
                source_b="Security Desk Incident Log (Officer Daniels)",
                conflict_summary="Timestamp discrepancy of 18 minutes (22:42 UTC vs 23:00 UTC) and contradictory sensor modalities (physical acoustic threshold vs HVAC thermal relay).",
                is_genuine_contradiction=True,
                severity="high",
                suggested_reconciliation="Cross-reference central BMS (Building Management System) telemetry archive to verify whether HVAC tripped or was fabricated."
            ),
            Contradiction(
                id="CON-03",
                claim_a="Server Room B remained completely secured and locked under active surveillance throughout the entire evening (EVD-005).",
                claim_b="Officer Daniels discovered secondary magnetic lock disengaged, door ajar by 4 inches, and physical lock cylinder showing tool scratches (EVD-001).",
                evidence_a_id="EVD-005",
                evidence_b_id="EVD-001",
                source_a="IT Director Vikram Malhotra Memo",
                source_b="Security Desk Incident Log (Officer Daniels)",
                conflict_summary="Direct conflict between executive claim of unbroken perimeter lock status and physical first-responder findings of door ajar and lock tampering.",
                is_genuine_contradiction=True,
                severity="critical",
                suggested_reconciliation="Forensic examination of magnetic lock relay circuits and physical lock cylinder micro-scratches."
            )
        ],
        timeline=[
            TimelineEvent(
                id="EVT-01",
                timestamp="2026-10-24 20:14:02 UTC",
                is_inferred=False,
                title="Authorized SysAdmin Access",
                description="Lead SysAdmin Alice Vance badges into Server Room B for scheduled maintenance.",
                primary_evidence_id="EVD-003",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-02",
                timestamp="2026-10-24 20:45:11 UTC",
                is_inferred=False,
                title="SysAdmin Egress",
                description="Alice Vance exits Server Room B; portal returns to secured state.",
                primary_evidence_id="EVD-003",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-03",
                timestamp="2026-10-24 22:15:30 UTC",
                is_inferred=False,
                title="Contractor Access Denied at Server Room B",
                description="HVAC Contractor Marcus Reed (Badge B-4091) attempts entry at Reader 202-B; system returns ACCESS DENIED due to expired security certification.",
                primary_evidence_id="EVD-003",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-04",
                timestamp="2026-10-24 22:18:14 UTC",
                is_inferred=False,
                title="Visual Surveillance of Subject Approaching Server Room",
                description="CCTV Cam-04 captures individual in high-vis vest and cap carrying black Pelican 1510 storm case traversing NW Corridor toward Server Room B.",
                primary_evidence_id="EVD-002",
                supporting_evidence_ids=["EVD-003"],
                confidence=0.98
            ),
            TimelineEvent(
                id="EVT-05",
                timestamp="2026-10-24 22:25:00 UTC",
                is_inferred=True,
                title="Eyewitness Sighting at Stairwell B",
                description="Dr. Evelyn Chen observes individual matching CCTV description descending Stairwell B with heavy Pelican case toward loading bay exit.",
                primary_evidence_id="EVD-004",
                supporting_evidence_ids=["EVD-002"],
                confidence=0.88
            ),
            TimelineEvent(
                id="EVT-06",
                timestamp="2026-10-24 22:28:44 UTC",
                is_inferred=False,
                title="Emergency Master Override Ingress",
                description="Reader 202-B logs Manual Bypass using Master Override Key B-9999. Ingress achieved without standard two-factor badge pin.",
                primary_evidence_id="EVD-003",
                supporting_evidence_ids=["EVD-001"],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-07",
                timestamp="2026-10-24 22:39:10 UTC",
                is_inferred=False,
                title="Master Override Egress",
                description="Reader 202-B logs egress transaction on Master Override Key B-9999 after 10 minutes and 26 seconds inside facility.",
                primary_evidence_id="EVD-003",
                supporting_evidence_ids=["EVD-001"],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-08",
                timestamp="2026-10-24 22:42:15 UTC",
                is_inferred=False,
                title="Acoustic Sensor Alarm Trigger",
                description="Sensor 4A detects anomalous acoustic profile. Officer Daniels dispatched to investigate.",
                primary_evidence_id="EVD-001",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-09",
                timestamp="2026-10-24 22:45:00 UTC",
                is_inferred=False,
                title="Physical Security Discovery of Breach",
                description="Officer Daniels finds Server Room B door ajar by 4 inches, magnetic lock disengaged, mechanical lock scratched, and Server Rack 04 thumbscrews removed.",
                primary_evidence_id="EVD-001",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
            TimelineEvent(
                id="EVT-10",
                timestamp="2026-10-25 06:15:00 UTC",
                is_inferred=False,
                title="Contradictory IT Director Memo Issued",
                description="IT Director Vikram Malhotra broadcasts memo asserting no badge activity occurred after 20:00 and room remained locked all night.",
                primary_evidence_id="EVD-005",
                supporting_evidence_ids=[],
                confidence=1.0
            ),
        ],
        unresolved_questions=[
            UnresolvedQuestion(
                id="QST-01",
                question="Who had physical possession and cryptographic authorization for Master Override Key B-9999 on the evening of October 24?",
                related_evidence_ids=["EVD-003"],
                recommended_action="Subpoena Key Control Cabinet biometric access logs for vault slot #7.",
                priority="urgent"
            ),
            UnresolvedQuestion(
                id="QST-02",
                question="Why is the IT Director's official incident notification in direct factual conflict with Lenel access records and first responder logs?",
                related_evidence_ids=["EVD-003", "EVD-005", "EVD-001"],
                recommended_action="Conduct recorded formal interview with IT Director Vikram Malhotra regarding memo origination.",
                priority="urgent"
            ),
            UnresolvedQuestion(
                id="QST-03",
                question="What specific hardware or storage modules were removed from Server Rack Cabinet 04?",
                related_evidence_ids=["EVD-001", "EVD-002"],
                recommended_action="Execute immediate physical asset serial number audit against Rack 04 baseline inventory.",
                priority="high"
            )
        ],
        proposed_tasks=[
            InvestigationTask(
                id="TSK-01",
                title="Preserve and Audit Key Control Cabinet Biometric Telemetry",
                description="Issue urgent preservation order for Key Vault Cabinet #1 logs to identify the user who retrieved Master Override Key B-9999 prior to 22:28 UTC.",
                evidence_ids=["EVD-003", "EVD-001"],
                status="pending_approval",
                audit_log=["Generated via Gemma 4 Agentic Tool Action [create_investigation_task] awaiting investigator approval."]
            ),
            InvestigationTask(
                id="TSK-02",
                title="Interview HVAC Contractor Marcus Reed",
                description="Depose contractor Marcus Reed regarding badge swipe denial at 22:15:30 UTC and whether his credentials or uniforms were cloned or borrowed.",
                evidence_ids=["EVD-002", "EVD-003", "EVD-004"],
                status="pending_approval",
                audit_log=["Generated via Gemma 4 Agentic Tool Action [create_investigation_task] awaiting investigator approval."]
            ),
            InvestigationTask(
                id="TSK-03",
                title="Formal Deposition Request: IT Director Vikram Malhotra",
                description="Schedule formal inquiry into conflicting statements made in EVD-005 regarding lack of access after 20:00 UTC.",
                evidence_ids=["EVD-003", "EVD-005"],
                status="pending_approval",
                audit_log=["Generated via Gemma 4 Agentic Tool Action [create_investigation_task] awaiting investigator approval."]
            )
        ],
        overall_confidence=0.94,
        executive_overview="Analysis reveals a substantiated unauthorized physical intrusion into Server Room B between 22:18 and 22:39 UTC utilizing an Emergency Master Override Key (B-9999) following a failed contractor swipe. Server Rack 04 cold-storage enclosure was opened, and a subject was observed transporting a Pelican case to the loading bay. This is in direct, critical contradiction with IT Director Malhotra's morning status update asserting unbroken security and zero activity after 20:00 UTC."
    )

def get_deterministic_report() -> InvestigationReport:
    analysis = get_deterministic_analysis_result()
    return InvestigationReport(
        report_title="CRITICAL INVESTIGATION REPORT: SERVER ROOM B PHYSICAL SECURITY BREACH",
        case_name="Operation Apex Glass - Corporate Server Facility Breach",
        generated_at="2026-10-25T07:30:00Z",
        model_used="gemma-4-26b-a4b-it",
        classification="CONFIDENTIAL // LAW ENFORCEMENT & GENERAL COUNSEL ONLY",
        executive_summary="""ECHO intelligence analysis has reconciled multi-modal evidence across electronic keycard registries, security officer incident logs, surveillance imagery, eyewitness testimony, and executive communications. 

The synthesized timeline establishes that an unauthorized breach occurred at Server Room B between 22:18 UTC and 22:39 UTC on October 24, 2026. An unidentified individual dressed in contractor attire gained entry using an Emergency Master Override Key (B-9999), unlatched Server Rack Cabinet 04, and evacuated the building via Stairwell B carrying a loaded Pelican storm case. 

Crucially, the formal memo circulated by IT Director Vikram Malhotra on October 25 claiming 'zero badge activity after 20:00 UTC' and attributing the incident to an 'HVAC sensor trip at 23:00 UTC' is directly refuted by cryptographic access logs and first-responder documentation. This represents a severe contradiction requiring immediate executive investigation.""",
        verified_timeline=analysis.timeline,
        contradiction_matrix=analysis.contradictions,
        key_findings=[
            {
                "finding": "Physical Tampering and Door Breach Confirmed",
                "evidence_references": ["EVD-001"],
                "status": "VERIFIED_PHYSICAL",
                "details": "Door found ajar 4 inches, magnetic latch disengaged, cylinder lock scratched, Server Rack 04 thumb screws removed."
            },
            {
                "finding": "Master Override Key Exploitation",
                "evidence_references": ["EVD-003"],
                "status": "VERIFIED_LOG",
                "details": "Emergency bypass key B-9999 granted access at 22:28:44 UTC and exited at 22:39:10 UTC immediately after contractor badge B-4091 was rejected."
            },
            {
                "finding": "Direct Contradiction in Executive Reporting",
                "evidence_references": ["EVD-003", "EVD-005", "EVD-001"],
                "status": "CONTRADICTION_CRITICAL",
                "details": "Director Malhotra's claim of no access after 20:00 UTC and 23:00 HVAC alert directly conflicts with 22:28-22:39 ingress and 22:42 acoustic alarm."
            },
            {
                "finding": "Corroborated Eyewitness and Visual Match",
                "evidence_references": ["EVD-002", "EVD-004"],
                "status": "VERIFIED_CORROBORATED",
                "details": "CCTV Cam-04 and Dr. Evelyn Chen independently confirm an individual in high-vis vest and cap transporting a Pelican 1510 case between 22:18 and 22:25 UTC."
            }
        ],
        evidence_limitations=[
            "Cam-04 corridor still captures subject at three-quarters angle; facial features partially shadowed under cap brim.",
            "Key Control Cabinet logs for physical key B-9999 have not yet been produced for verification.",
            "Stairwell B loading dock door has no direct CCTV camera coverage."
        ],
        recommended_actions=[
            "Approve proposed Task TSK-01 to immediately secure and mirror Key Control Cabinet telemetry.",
            "Approve proposed Task TSK-02 to question HVAC Contractor Marcus Reed under formal inquiry.",
            "Approve proposed Task TSK-03 for executive inquiry into IT Director Vikram Malhotra regarding misleading communication.",
            "Initiate physical asset audit of Server Rack 04 storage arrays to identify missing drives or media."
        ],
        disclaimer="Report generated by ECHO Multimodal Evidence Intelligence Engine using Google Gemma 4 architecture. All conclusions are strictly anchored to source evidence references. Uncorroborated assertions have been explicitly classified as unverified."
    )
