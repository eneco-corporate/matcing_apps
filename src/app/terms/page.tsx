import Link from 'next/link';
import Card from '@/components/Card';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            トップページに戻る
          </Link>
        </div>

        <Card>
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">利用規約</h1>

          <div className="prose prose-neutral max-w-none">
            <p className="text-sm text-neutral-600 mb-6">
              最終更新日: 2024年12月24日
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第1条（適用）</h2>
              <p className="text-neutral-700 mb-4">
                本規約は、FriendMatch（以下「当サービス」）が提供するサービスの利用条件を定めるものです。
                登録ユーザーの皆様（以下「ユーザー」）には、本規約に従って当サービスをご利用いただきます。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第2条（利用登録）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>登録希望者は、本規約に同意の上、当サービスの定める方法によって利用登録を申請するものとします。</li>
                <li>当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当サービスが利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第3条（本人確認）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>ユーザーは、当サービスが定める本人確認手続きを完了する必要があります。</li>
                <li>本人確認が完了していないユーザーは、一部の機能（イベントへの参加等）を利用できません。</li>
                <li>当サービスは、提出された本人確認書類を厳重に管理し、本人確認の目的以外には使用しません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第4条（禁止事項）</h2>
              <p className="text-neutral-700 mb-3">ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>他のユーザー、第三者または当サービスの権利を侵害する行為</li>
                <li>他のユーザーに対する嫌がらせ、誹謗中傷、ハラスメント行為</li>
                <li>虚偽の情報を登録する行為</li>
                <li>営利目的での利用</li>
                <li>当サービスのネットワークまたはシステム等に過度な負荷をかける行為</li>
                <li>当サービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスまたは試みる行為</li>
                <li>複数のアカウントを作成する行為</li>
                <li>その他、当サービスが不適切と判断する行為</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第5条（安全ガイドライン）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>ユーザーは、他のユーザーとの対面での集まりに際して、安全に配慮するものとします。</li>
                <li>初回の集まりは、必ず公共の場所で行うことを推奨します。</li>
                <li>集まりの予定は、信頼できる第三者に共有することを推奨します。</li>
                <li>違和感や危険を感じた場合は、速やかに当サービスに通報してください。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第6条（ユーザーIDおよびパスワードの管理）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを適切に管理するものとします。</li>
                <li>ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与してはなりません。</li>
                <li>ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合、当サービスは当該ユーザーIDを登録しているユーザー自身による利用とみなします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第7条（利用制限および登録抹消）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>当サービスは、ユーザーが以下のいずれかに該当する場合、事前の通知なく、当該ユーザーに対して、当サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-2">
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録事項に虚偽の事実があることが判明した場合</li>
                    <li>料金等の支払債務の不履行があった場合（将来的に決済機能実装後）</li>
                    <li>当サービスからの連絡に対し、一定期間返答がない場合</li>
                    <li>その他、当サービスが当サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </li>
                <li>当サービスは、本条に基づき当サービスが行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第8条（保証の否認および免責事項）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>当サービスは、当サービスが事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを保証しません。</li>
                <li>当サービスは、当サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。ただし、当サービスに関する当サービスとユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。</li>
                <li>ユーザー間のトラブルについては、当事者間で解決するものとし、当サービスは一切の責任を負いません。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第9条（サービス内容の変更等）</h2>
              <p className="text-neutral-700">
                当サービスは、ユーザーに通知することなく、当サービスの内容を変更したり、当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第10条（利用規約の変更）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。</li>
                <li>変更後の本規約は、当サービス上に表示した時点より効力を生じるものとします。</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第11条（個人情報の取扱い）</h2>
              <p className="text-neutral-700">
                当サービスは、当サービスの利用によって取得する個人情報については、当サービスの<Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">プライバシーポリシー</Link>に従い適切に取り扱うものとします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第12条（通知または連絡）</h2>
              <p className="text-neutral-700">
                ユーザーと当サービスとの間の通知または連絡は、当サービスの定める方法によって行うものとします。当サービスは、ユーザーから、当サービスが別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第13条（権利義務の譲渡の禁止）</h2>
              <p className="text-neutral-700">
                ユーザーは、当サービスの書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">第14条（準拠法・裁判管轄）</h2>
              <ol className="list-decimal list-inside space-y-3 text-neutral-700">
                <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
                <li>当サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
              </ol>
            </section>

            <div className="mt-12 pt-8 border-t border-neutral-200">
              <p className="text-neutral-600 text-sm">
                本規約に関するお問い合わせは、当サービスのお問い合わせフォームよりご連絡ください。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
