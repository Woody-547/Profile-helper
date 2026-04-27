import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from '../types';

export const exportToWord = async (data: ResumeData) => {
    const children: any[] = [];
    
    // Header
    if (data.personalInfo.fullName) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: data.personalInfo.fullName, bold: true, size: 48 }) // 24pt
            ]
        }));
    }
    
    if (data.personalInfo.jobTitle) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: data.personalInfo.jobTitle, size: 28, color: "666666" }) // 14pt
            ]
        }));
    }
    
    const contactInfo = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.website].filter(Boolean).join(" | ");
    if (contactInfo) {
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({ text: contactInfo, size: 20, color: "666666" }) // 10pt
            ]
        }));
        children.push(new Paragraph({ text: "" })); // spacing
    }
    
    // Summary
    if (data.personalInfo.summary) {
        children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "个人简介",
            spacing: { before: 200, after: 120 }
        }));
        children.push(new Paragraph({
            text: data.personalInfo.summary,
            spacing: { after: 200 }
        }));
    }
    
    // Experience
    if (data.experience.length > 0) {
        children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "工作经历",
            spacing: { before: 200, after: 120 }
        }));
        
        data.experience.forEach(exp => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: exp.role || '职位', bold: true, size: 24 }),
                    new TextRun({ text: `，${exp.company || '公司名称'}`, bold: true, size: 24 }),
                ],
                spacing: { before: 120 }
            }));
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: `${exp.startDate} ${exp.endDate ? `— ${exp.endDate}` : ''}`, italics: true, size: 20, color: "666666" })
                ],
                spacing: { after: 120 }
            }));
            if (exp.description) {
                exp.description.split('\n').forEach(line => {
                    children.push(new Paragraph({ text: line }));
                });
            }
        });
    }
    
    // Education
    if (data.education.length > 0) {
        children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "教育背景",
            spacing: { before: 400, after: 120 }
        }));
        
        data.education.forEach(edu => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: edu.school || '学校名', bold: true, size: 24 }),
                    new TextRun({ text: ` — ${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}`, size: 24 }),
                ],
                spacing: { before: 120 }
            }));
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: `${edu.startDate} ${edu.endDate ? `— ${edu.endDate}` : ''}`, italics: true, size: 20, color: "666666" })
                ],
                spacing: { after: 120 }
            }));
        });
    }
    
    // Skills
    if (data.skills.length > 0) {
        children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "常用技能",
            spacing: { before: 400, after: 120 }
        }));
        children.push(new Paragraph({
            text: data.skills.join(" • ")
        }));
    }
    
    // Projects
    if (data.projects.length > 0) {
        children.push(new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "项目经历",
            spacing: { before: 400, after: 120 }
        }));
        
        data.projects.forEach(proj => {
            children.push(new Paragraph({
                children: [
                    new TextRun({ text: proj.title || '项目名称', bold: true, size: 24 }),
                    ...(proj.link ? [new TextRun({ text: ` (${proj.link})`, italics: true, size: 20, color: "0000FF" })] : [])
                ],
                spacing: { before: 120 }
            }));
            if (proj.description) {
                proj.description.split('\n').forEach(line => {
                    children.push(new Paragraph({ text: line }));
                });
            }
        });
    }

    const doc = new Document({
        styles: {
            default: {
                heading1: {
                    run: {
                        size: 28,
                        bold: true,
                        color: "333333",
                        font: "SimHei",
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                        border: {
                            bottom: {
                                color: "cccccc",
                                space: 1,
                                value: "single",
                                size: 6,
                            },
                        },
                    },
                },
                document: {
                    run: {
                        font: "SimSun",
                        size: 22,
                    }
                }
            }
        },
        sections: [{
            properties: {},
            children: children
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.personalInfo.fullName || 'Resume'}.docx`);
};
