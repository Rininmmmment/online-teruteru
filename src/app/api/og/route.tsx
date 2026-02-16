import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';
    const memo = searchParams.get('memo') || '';
    const type = searchParams.get('type') || 'normal';

    // Determine visuals
    const isSakasa = type === 'sakasa';
    const bgColor = isSakasa ? '#cfd8dc' : '#b3e5fc';
    const textColor = '#37474f';

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: bgColor,
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Title */}
                <div style={{ fontSize: 40, fontWeight: 'bold', color: textColor, marginBottom: 20 }}>
                    {date ? `${date}の天気願い` : 'オンラインてるてる坊主'}
                </div>

                {/* Teru Teru Bozu Representation (Simplified for OG) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* String */}
                    <div style={{ width: 4, height: 60, background: '#eee', marginBottom: -10, zIndex: 1 }}></div>

                    {/* Head */}
                    <div style={{
                        width: 120, height: 120,
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        transform: isSakasa ? 'rotate(180deg)' : 'none'
                    }}>
                        {/* Face */}
                        <div style={{ display: 'flex', gap: 20 }}>
                            <div style={{ width: 12, height: 12, background: '#333', borderRadius: '50%' }}></div>
                            <div style={{ width: 12, height: 12, background: '#333', borderRadius: '50%' }}></div>
                        </div>
                    </div>

                    {/* Body */}
                    <div style={{
                        width: 0, height: 0,
                        borderLeft: '60px solid transparent',
                        borderRight: '60px solid transparent',
                        borderBottom: '100px solid white',
                        marginTop: -20,
                        transform: isSakasa ? 'rotate(180deg) translateY(-20px)' : 'none'
                    }}></div>
                </div>

                {/* Tag/Memo */}
                {memo && (
                    <div style={{
                        marginTop: 40,
                        background: 'rgba(255,255,255,0.8)',
                        padding: '10px 30px',
                        borderRadius: 20,
                        fontSize: 30,
                        color: textColor,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {memo}
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
